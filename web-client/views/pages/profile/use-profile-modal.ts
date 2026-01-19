'use client';
import { create } from 'zustand';

interface ProfileModalState {
  // Avatar dialog states
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

  // Cover history dialog states
  isCoverHistoryDialogOpen: boolean;
  openCoverHistoryDialog: () => void;
  closeCoverHistoryDialog: () => void;
  selectedCoverUrl: string | null;
  setSelectedCoverUrl: (url: string | null) => void;
  resetCoverHistoryDialog: () => void;

  // Cover upload states
  coverImagePreview: string | null;
  setCoverImagePreview: (preview: string | null) => void;
  pendingFile: File | null;
  setPendingFile: (file: File | null) => void;
  showConfirmChangeCoverUrl: boolean;
  setShowConfirmChangeCoverUrl: (show: boolean) => void;
  fileInputRef: { current: HTMLInputElement | null };
  resetCoverUpload: () => void;

  // edit container
  openEditContainer: () => void;
  closeEditContainer: () => void;
  setEditContainerOpen: (open: boolean) => void;
  isEditContainerOpen: boolean;

  // change cover
  openChangeCover: () => void;
  closeChangeCover: () => void;
  setChangeCoverOpen: (open: boolean) => void;
  isChangeCoverOpen: boolean;

  // is click modal edit
  isClickModalEdit: boolean;
  setIsClickModalEdit: (click: boolean) => void;
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

  isCoverHistoryDialogOpen: false,
  openCoverHistoryDialog: () => set({ isCoverHistoryDialogOpen: true }),
  closeCoverHistoryDialog: () => set({ isCoverHistoryDialogOpen: false }),
  selectedCoverUrl: null,
  setSelectedCoverUrl: (url: string | null) => set({ selectedCoverUrl: url }),
  resetCoverHistoryDialog: () =>
    set({
      isCoverHistoryDialogOpen: false,
      selectedCoverUrl: null,
    }),

  coverImagePreview: null,
  setCoverImagePreview: (preview: string | null) => set({ coverImagePreview: preview }),
  pendingFile: null,
  setPendingFile: (file: File | null) => set({ pendingFile: file }),
  showConfirmChangeCoverUrl: false,
  setShowConfirmChangeCoverUrl: (show: boolean) => set({ showConfirmChangeCoverUrl: show }),
  fileInputRef: { current: null },
  resetCoverUpload: () =>
    set({
      coverImagePreview: null,
      pendingFile: null,
      showConfirmChangeCoverUrl: false,
    }),

  isEditContainerOpen: false,
  openEditContainer: () => set({ isEditContainerOpen: true }),
  closeEditContainer: () => set({ isEditContainerOpen: false }),
  setEditContainerOpen: (open: boolean) => set({ isEditContainerOpen: open }),

  isChangeCoverOpen: false,
  openChangeCover: () => set({ isChangeCoverOpen: true }),
  closeChangeCover: () => set({ isChangeCoverOpen: false }),
  setChangeCoverOpen: (open: boolean) => set({ isChangeCoverOpen: open }),

  isClickModalEdit: false,
  setIsClickModalEdit: (click: boolean) => set({ isClickModalEdit: click }),
}));
