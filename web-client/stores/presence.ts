'use client';

import { create } from 'zustand';

interface PresenceState {
  userOnline: Record<string, boolean>;
  setUserOnline: (userId: string, online: boolean) => void;
}

export const usePresenceStore = create<PresenceState>(set => ({
  userOnline: {},
  setUserOnline: (userId, online) =>
    set(state => ({
      userOnline: { ...state.userOnline, [userId]: online },
    })),
}));
