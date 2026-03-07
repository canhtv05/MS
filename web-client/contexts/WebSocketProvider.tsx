'use client';

import { WS_BASE_URL } from '@/configs/endpoints';
import { useWebSocket, type WsReadyState } from '@/hooks/use-websocket';
import { logger } from '@/lib/logger';
import { useAuthStore } from '@/stores/auth';
import { usePresenceStore } from '@/stores/presence';
import cookieUtils from '@/utils/cookieUtils';
import { handleRedirectLogin } from '@/utils/api';
import { useRouter } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useEffect,
  useRef,
  ReactNode,
} from 'react';
import { WsType } from '@/enums/common';
import { toast } from 'sonner';
import { encodeWsMessage, decodeWsMessage, type WsMessagePayload } from '@/lib/ws-proto';

export type WebSocketContextValue = {
  readyState: WsReadyState;
  readyStateLabel: string;
  lastMessage: MessageEvent | null;
  send: (payload: WsMessagePayload) => Promise<boolean>;
  sendToUser: (userId: string, data: Record<string, unknown>) => Promise<boolean>;
  sendToAll: (data: Record<string, unknown>) => Promise<boolean>;
  requestUserOnline: (userId: string) => Promise<boolean>;
  subscribe: (topic: string) => Promise<boolean>;
  unsubscribe: (topic: string) => Promise<boolean>;
};

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

export function useWebSocketContext(): WebSocketContextValue | null {
  return useContext(WebSocketContext);
}

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const user = useAuthStore(s => s.user);
  const setUser = useAuthStore(s => s.setUser);
  const router = useRouter();
  const subscribedTopicsRef = useRef<Set<string>>(new Set());
  const topicRefCountRef = useRef<Record<string, number>>({});
  const isAuthenticated = !!user || cookieUtils.getAuthenticated();
  const wsUrl = useMemo(() => (isAuthenticated ? `${WS_BASE_URL}/ws` : null), [isAuthenticated]);

  const { readyState, readyStateLabel, lastMessage, disconnect, sendBinary } = useWebSocket(wsUrl);

  useEffect(() => {
    if (isAuthenticated && wsUrl) {
      logger.info('[WS Provider] authenticated, wsUrl=', wsUrl);
    }
    if (!isAuthenticated) {
      logger.debug('[WS Provider] not authenticated, disconnect');
      disconnect();
    }
  }, [isAuthenticated, wsUrl, disconnect]);

  const send = useCallback(
    async (payload: WsMessagePayload) => {
      try {
        const bytes = await encodeWsMessage(payload);
        return sendBinary(bytes);
      } catch (e) {
        logger.error('[WS Provider] send encode error', e);
        return false;
      }
    },
    [sendBinary],
  );

  const sendToUser = useCallback(
    async (userId: string, data: Record<string, unknown>) => {
      const ok = await send({
        type: WsType.MESSAGE,
        userId,
        data: JSON.stringify(data),
      });
      if (ok) logger.debug('[WS Provider] sendToUser', { userId, data });
      return ok;
    },
    [send],
  );

  const sendToAll = useCallback(
    async (data: Record<string, unknown>) => {
      const ok = await send({
        type: WsType.MESSAGE,
        data: JSON.stringify(data),
      });
      if (ok) logger.debug('[WS Provider] sendToAll', data);
      return ok;
    },
    [send],
  );

  useEffect(() => {
    if (readyState !== 1) return;
    const interval = setInterval(() => {
      send({ type: WsType.PING }).then(ok => {
        if (ok) logger.debug('[WS Provider] ping sent');
      });
    }, 60_000); // 1 phút
    return () => clearInterval(interval);
  }, [readyState, send]);

  const setUserOnline = usePresenceStore(s => s.setUserOnline);

  const requestUserOnline = useCallback(
    async (userId: string) => send({ type: WsType.CHECK_USER_ONLINE, userId: userId }),
    [send],
  );

  const subscribe = useCallback(
    async (topic: string) => {
      const t = topic?.trim();
      if (!t) return false;
      // count the number of times this topic has been subscribed
      const count = (topicRefCountRef.current[t] ?? 0) + 1;
      topicRefCountRef.current[t] = count;
      if (count === 1) {
        subscribedTopicsRef.current.add(t);
        if (readyState === 1) return send({ type: WsType.SUBSCRIBE, topic: t });
      }
      return true;
    },
    [send, readyState],
  );

  const unsubscribe = useCallback(
    async (topic: string) => {
      const t = topic?.trim();
      if (!t) return false;
      // count the number of times this topic has been unsubscribed
      const count = Math.max(0, (topicRefCountRef.current[t] ?? 1) - 1);
      if (count === 0) {
        delete topicRefCountRef.current[t];
        subscribedTopicsRef.current.delete(t);
        if (readyState === 1) return send({ type: WsType.UNSUBSCRIBE, topic: t });
      } else {
        topicRefCountRef.current[t] = count;
      }
      return true;
    },
    [send, readyState],
  );

  useEffect(() => {
    if (readyState !== 1 || subscribedTopicsRef.current.size === 0) return;
    const topics = Array.from(subscribedTopicsRef.current);
    topics.forEach(t => send({ type: WsType.SUBSCRIBE, topic: t }));
  }, [readyState, send]);

  const processMessage = useCallback(
    (msg: WsMessagePayload) => {
      switch (msg.type) {
        case WsType.KICK:
          logger.info('[WS Provider] KICK received, redirect to login');
          setUser(undefined);
          cookieUtils.clearAuthenticated();
          handleRedirectLogin(true);
          router.refresh();
          break;
        case WsType.FRIEND_REQUEST:
          logger.info('[WS Provider] FRIEND_REQUEST received', msg);
          toast.success(`Bạn có yêu cầu kết bạn mới ${msg.data ?? ''}`);
          break;
        case WsType.USER_ONLINE:
          if (msg.userId) setUserOnline(msg.userId, true);
          break;
        case WsType.USER_OFFLINE:
          if (msg.userId) setUserOnline(msg.userId, false);
          break;
        default:
          break;
      }
    },
    [setUser, router, setUserOnline],
  );

  useEffect(() => {
    if (!lastMessage || !(lastMessage.data instanceof ArrayBuffer)) return;
    decodeWsMessage(lastMessage.data)
      .then(msg => {
        logger.debug('[WS Provider] lastMessage (decoded)', msg);
        processMessage(msg);
      })
      .catch(e => logger.warn('[WS Provider] decode message error', e));
  }, [lastMessage, processMessage]);

  const value = useMemo<WebSocketContextValue>(
    () => ({
      readyState,
      readyStateLabel,
      lastMessage,
      send,
      sendToUser,
      sendToAll,
      requestUserOnline,
      subscribe,
      unsubscribe,
    }),
    [
      readyState,
      readyStateLabel,
      lastMessage,
      send,
      sendToUser,
      sendToAll,
      requestUserOnline,
      subscribe,
      unsubscribe,
    ],
  );

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
}
