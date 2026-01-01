'use client';
import { create } from 'zustand';

interface ProfileModalState {
  isParentDialogOpen: boolean;
  openParentDialog: () => void;
  closeParentDialog: () => void;
  setParentDialogOpen: (open: boolean) => void;
  setChildDialogOpen: (open: boolean) => void;
  isChildDialogOpen: boolean;
  openChildDialog: () => void;
  closeChildDialog: () => void;
  isPending: boolean;
  setIsPending: (pending: boolean) => void;
}

export const useProfileModalStore = create<ProfileModalState>(set => ({
  isParentDialogOpen: false,
  isChildDialogOpen: false,
  isPending: false,
  openParentDialog: () => set({ isParentDialogOpen: true }),
  closeParentDialog: () => set({ isParentDialogOpen: false }),
  setParentDialogOpen: (open: boolean) => set({ isParentDialogOpen: open }),
  openChildDialog: () => set({ isChildDialogOpen: true }),
  closeChildDialog: () => set({ isChildDialogOpen: false }),
  setChildDialogOpen: (open: boolean) => set({ isChildDialogOpen: open }),
  setIsPending: (pending: boolean) => set({ isPending: pending }),
}));
