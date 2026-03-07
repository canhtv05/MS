'use client';

import { useEffect, useRef } from 'react';
import { useWebSocketContext } from '@/contexts/WebSocketProvider';
import { usePresenceStore } from '@/stores/presence';
import { useAuthStore } from '@/stores/auth';

export function getPresenceTopic(userId: string) {
  return `presence:${userId}`;
}

export function useIsUserOnline(userId: string | null | undefined, enabled = true) {
  const ws = useWebSocketContext();
  const currentUserId = useAuthStore(s => s.user?.profile?.userId);
  const userOnline = usePresenceStore(s => s.userOnline);
  const lastRequestedUserId = useRef<string | null>(null);

  const isOwn = !!userId && userId === currentUserId;
  const isOnline = isOwn ? ws?.readyState === 1 : userId ? (userOnline[userId] ?? false) : false;

  useEffect(() => {
    if (!enabled || !userId || isOwn || !ws) return;
    const topic = getPresenceTopic(userId);
    ws.subscribe(topic);
    return () => {
      ws.unsubscribe(topic);
    };
  }, [enabled, userId, isOwn, ws]);

  useEffect(() => {
    if (!enabled || !userId || !ws?.requestUserOnline || isOwn) return;
    if (lastRequestedUserId.current === userId) return;
    lastRequestedUserId.current = userId;
    ws.requestUserOnline(userId);
  }, [enabled, userId, isOwn, ws]);

  const refetch = () => {
    if (userId && ws?.requestUserOnline) ws.requestUserOnline(userId);
  };

  return {
    isOnline: !!isOnline,
    isLoading: false,
    refetch,
  };
}
