'use client';

import { WS_BASE_URL } from '@/configs/endpoints';
import { useWebSocket, type WsReadyState } from '@/hooks/use-websocket';
import { logger } from '@/lib/logger';
import { useAuthStore } from '@/stores/auth';
import cookieUtils from '@/utils/cookieUtils';
import { handleRedirectLogin } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useMemo, useEffect, ReactNode } from 'react';

export type WebSocketContextValue = {
  readyState: WsReadyState;
  readyStateLabel: string;
  lastMessage: string | null;
  send: (message: string) => boolean;
  sendToUser: (userId: string, data: Record<string, unknown>) => boolean;
  sendToAll: (data: Record<string, unknown>) => boolean;
};

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

export function useWebSocketContext(): WebSocketContextValue | null {
  return useContext(WebSocketContext);
}

/** Gửi message tới server (server có thể forward theo type). */
const WS_TYPE = {
  SEND_TO_USER: 'SEND_TO_USER',
  SEND_TO_ALL: 'SEND_TO_ALL',
} as const;

/** Kết nối WS khi đã login; F5 thì reconnect. Xử lý message KICK → redirect login. */
export function WebSocketProvider({ children }: { children: ReactNode }) {
  const user = useAuthStore(s => s.user);
  const setUser = useAuthStore(s => s.setUser);
  const router = useRouter();

  const isAuthenticated = !!user || cookieUtils.getAuthenticated();
  const wsUrl = useMemo(() => (isAuthenticated ? `${WS_BASE_URL}/ws` : null), [isAuthenticated]);

  const { readyState, readyStateLabel, lastMessage, disconnect, send } = useWebSocket(wsUrl);

  useEffect(() => {
    if (isAuthenticated && wsUrl) {
      logger.info('[WS Provider] authenticated, wsUrl=', wsUrl);
    }
    if (!isAuthenticated) {
      logger.debug('[WS Provider] not authenticated, disconnect');
      disconnect();
    }
  }, [isAuthenticated, wsUrl, disconnect]);

  const sendToUser = useCallback(
    (userId: string, data: Record<string, unknown>) => {
      const payload = JSON.stringify({ type: WS_TYPE.SEND_TO_USER, userId, data });
      const ok = send(payload);
      if (ok) logger.debug('[WS Provider] sendToUser', { userId, data });
      return ok;
    },
    [send],
  );

  const sendToAll = useCallback(
    (data: Record<string, unknown>) => {
      const payload = JSON.stringify({ type: WS_TYPE.SEND_TO_ALL, data });
      const ok = send(payload);
      if (ok) logger.debug('[WS Provider] sendToAll', data);
      return ok;
    },
    [send],
  );

  useEffect(() => {
    if (!lastMessage) return;
    try {
      const msg = JSON.parse(lastMessage) as { type?: string };
      logger.debug('[WS Provider] lastMessage', msg);
      if (msg?.type === 'KICK') {
        logger.info('[WS Provider] KICK received, redirect to login');
        setUser(undefined);
        cookieUtils.clearAuthenticated();
        handleRedirectLogin(true);
        router.refresh();
      }
    } catch {
      // ignore non-JSON or parse error
    }
  }, [lastMessage, setUser, router]);

  const value = useMemo<WebSocketContextValue>(
    () => ({
      readyState,
      readyStateLabel,
      lastMessage,
      send,
      sendToUser,
      sendToAll,
    }),
    [readyState, readyStateLabel, lastMessage, send, sendToUser, sendToAll],
  );

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
}
