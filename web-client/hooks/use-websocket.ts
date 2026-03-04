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
      reconnectInterval: 2000, // cố định 2s cho nhanh, tránh backoff 16-30s
      onOpen: () => logger.info('[WS] connected', { url }),
      onClose: e =>
        logger.info('[WS] closed', { code: e?.code, reason: e?.reason, wasClean: e?.wasClean }),
      onError: () => logger.warn('[WS] error', { url }),
      onMessage: event => {
        if (typeof event.data === 'string') {
          logger.debug('[WS] raw message', event.data.slice(0, 200));
        }
      },
    },
    !!url,
  );

  const readyState = toReadyState(libReadyState);

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
    // Trả nguyên MessageEvent để mỗi lần message mới (kể cả data giống nhau) vẫn trigger re-render
    lastMessage,
    disconnect,
    send,
  };
}
