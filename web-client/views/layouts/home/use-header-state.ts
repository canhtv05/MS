'use client';
import { create } from 'zustand';

interface HeaderState {
  isChangePasswordDialogOpen: boolean;
  openChangePasswordDialog: () => void;
  closeChangePasswordDialog: () => void;
}

export const useHeaderState = create<HeaderState>(set => ({
  isChangePasswordDialogOpen: false,
  openChangePasswordDialog: () => set({ isChangePasswordDialogOpen: true }),
  closeChangePasswordDialog: () => set({ isChangePasswordDialogOpen: false }),
}));
