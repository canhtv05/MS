'use client';

import { useCallback } from 'react';
import useWebSocketLib from 'react-use-websocket';
import { logger } from '@/lib/logger';

export type WsReadyState = 0 | 1 | 2 | 3; // CONNECTING, OPEN, CLOSING, CLOSED

const READY_STATE_LABEL: Record<WsReadyState, string> = {
  0: 'CONNECTING',
  1: 'OPEN',
  2: 'CLOSING',
  3: 'CLOSED',
};

/** Chuẩn hóa readyState từ thư viện (-1,0,1,2,3) sang 0|1|2|3. */
function toReadyState(n: number): WsReadyState {
  if (n >= 0 && n <= 3) return n as WsReadyState;
  return 3; // UNINSTANTIATED hoặc invalid → CLOSED
}

export function useWebSocket(url: string | null) {
  const {
    sendMessage,
    lastMessage,
    readyState: libReadyState,
    getWebSocket,
  } = useWebSocketLib(
    url,
    {
      shouldReconnect: () => true,
      reconnectAttempts: 20,
      reconnectInterval: n => Math.min(1000 * 2 ** n, 30000),
      onOpen: () => logger.info('[WS] connected', { url }),
      onClose: e =>
        logger.info('[WS] closed', { code: e?.code, reason: e?.reason, wasClean: e?.wasClean }),
      onError: () => logger.warn('[WS] error', { url }),
      onMessage: () => {},
    },
    !!url,
  );

  const readyState = toReadyState(libReadyState);
  const lastMessageStr =
    lastMessage != null && typeof (lastMessage as MessageEvent).data === 'string'
      ? (lastMessage as MessageEvent).data
      : null;

  const disconnect = useCallback(() => {
    logger.debug('[WS] disconnect() called');
    const ws = getWebSocket();
    if (ws) ws.close();
  }, [getWebSocket]);

  const send = useCallback(
    (message: string) => {
      if (libReadyState !== 1) {
        logger.warn('[WS] send() ignored, readyState:', libReadyState);
        return false;
      }
      sendMessage(message);
      logger.debug('[WS] send:', message.slice(0, 100));
      return true;
    },
    [sendMessage, libReadyState],
  );

  return {
    readyState,
    readyStateLabel: READY_STATE_LABEL[readyState],
    lastMessage: lastMessageStr,
    disconnect,
    send,
  };
}
