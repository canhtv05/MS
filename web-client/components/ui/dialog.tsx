'use client';

import {
  Dialog as DialogRoot,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/animate-ui/primitives/base/dialog';
import { Button } from '../animate-ui/components/buttons/button';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { ReactNode, startTransition, useCallback, useEffect, useRef } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { XIcon } from '../animate-ui/icons';
import { IconButton } from '../animate-ui/components/buttons/icon';
import { toast } from 'sonner';
import { useModal } from '@/contexts/ModalContext';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';

type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface IDialog<T extends FieldValues = FieldValues> {
  children?: React.ReactNode;
  onAccept?: () => void;
  onClose?: () => void;
  title: string;
  titleNode?: ReactNode;
  description?: string;
  open: boolean;
  id?: string;
  size?: DialogSize;
  disableAccept?: boolean;
  form?: UseFormReturn<T>;
  disableFooter?: boolean;
  isPending?: boolean;
  hasBorder?: boolean;
}

const sizeClasses: Record<DialogSize, string> = {
  sm: 'max-w-sm! w-[calc(100%-2rem)] md:w-full max-h-[calc(100%-28px)] h-auto rounded-lg',
  md: 'max-w-lg! w-[calc(100%-2rem)] md:w-full max-h-[calc(100%-28px)] h-auto rounded-lg',
  lg: 'max-w-2xl! w-[calc(100%-2rem)] md:w-full max-h-[calc(100%-28px)] h-auto rounded-lg',
  xl: 'max-w-4xl! w-[calc(100%-2rem)] md:w-full max-h-[calc(100%-28px)] h-auto rounded-lg',
  full: 'max-w-[90vw]! w-[calc(100%-2rem)] md:w-full max-h-[calc(100%-28px)] h-auto rounded-lg',
};

const Dialog = <T extends FieldValues = FieldValues>({
  children,
  open,
  onAccept,
  onClose,
  title,
  description,
  id,
  size = 'md',
  disableAccept = false,
  form,
  disableFooter = false,
  titleNode,
  isPending = false,
  hasBorder = false,
}: IDialog<T>) => {
  const { t } = useTranslation();
  const modalIdRef = useRef<string>(`modal-${crypto.randomUUID()}`);
  const { openModal, closeTopModal } = useModal();
  const eventHandlerRef = useRef<((e: Event) => void) | null>(null);
  const isClosingRef = useRef<boolean>(false);
  const hasRegisteredRef = useRef<boolean>(false);
  const openModalRef = useRef(openModal);
  const closeTopModalRef = useRef(closeTopModal);
  const onCloseRef = useRef(onClose);
  const isPendingRef = useRef(isPending);
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const busy = isFetching + isMutating > 0;

  useEffect(() => {
    openModalRef.current = openModal;
    closeTopModalRef.current = closeTopModal;
    onCloseRef.current = onClose;
    isPendingRef.current = isPending;
  }, [openModal, closeTopModal, onClose, isPending]);

  const handleClose = useCallback(() => {
    if (isPendingRef.current || isClosingRef.current || busy) return;
    isClosingRef.current = true;
    onCloseRef.current?.();
    closeTopModalRef.current();
    setTimeout(() => {
      isClosingRef.current = false;
    }, 0);
  }, [busy]);

  const handleExternalCloseRef = useRef(() => {
    if (isPendingRef.current || isClosingRef.current || busy) return;
    isClosingRef.current = true;
    onCloseRef.current?.();
    setTimeout(() => {
      isClosingRef.current = false;
    }, 0);
  });

  useEffect(() => {
    if (!open) {
      hasRegisteredRef.current = false;
      return;
    }

    if (hasRegisteredRef.current) return;
    hasRegisteredRef.current = true;
    const currentModalId = modalIdRef.current;
    openModalRef.current(currentModalId);
    const handleModalCloseEvent = () => {
      handleExternalCloseRef.current();
    };

    eventHandlerRef.current = handleModalCloseEvent;
    document.addEventListener(`close-modal:${currentModalId}`, handleModalCloseEvent);
    document.addEventListener('close-all-modals', handleModalCloseEvent);
    return () => {
      hasRegisteredRef.current = false;
      if (eventHandlerRef.current) {
        document.removeEventListener(`close-modal:${currentModalId}`, eventHandlerRef.current);
        document.removeEventListener('close-all-modals', eventHandlerRef.current);
        eventHandlerRef.current = null;
      }
      document.removeEventListener('close-all-modals', handleModalCloseEvent);
    };
  }, [open]);

  const isAcceptDisabled =
    disableAccept || isPending || busy || (form ? !form.formState.isValid : disableAccept);
  const handleAccept = () => {
    if (isAcceptDisabled) {
      toast.error(t('button.accept_disabled'), { id: 'accept-disabled-toast' });
      return;
    }
    startTransition(() => {
      onAccept?.();
    });
  };

  return (
    <DialogRoot open={open} onOpenChange={isOpen => !isOpen && handleClose()} modal={true}>
      <DialogContent
        showOverlay={false}
        customOverlay={
          <div
            className="fixed inset-0 z-200 bg-black/80 animate-in fade-in-0 duration-200"
            aria-hidden
          />
        }
        className={cn(
          sizeClasses[size],
          hasBorder && 'p-0 gap-5 z-200!',
          'flex flex-col max-h-[calc(100%-28px)]',
        )}
        showCloseButton={false}
        onEscapeKeyDown={e => {
          if (isPending || busy) {
            e.preventDefault();
            return;
          }
          e.preventDefault();
          e.stopPropagation();
          handleClose();
        }}
        onInteractOutside={e => {
          if (isPending || busy) e.preventDefault();
        }}
        onPointerDownOutside={e => {
          if (isPending || busy) e.preventDefault();
        }}
        onOpenAutoFocus={e => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle
            className={cn(
              'flex items-start justify-center w-full flex-col gap-2',
              hasBorder ? 'border-b p-5' : '',
            )}
          >
            <div className="relative w-full flex items-center justify-between">
              <span suppressHydrationWarning className="font-semibold text-center flex-1">
                {title}
              </span>
              <IconButton
                disabled={isPending || busy}
                className="rounded-full absolute! right-0"
                variant="ghost"
                onClick={handleClose}
                autoFocus={false}
              >
                <XIcon />
              </IconButton>
            </div>
            {titleNode}
          </DialogTitle>
          <DialogDescription
            suppressHydrationWarning
            className={description ? 'text-muted-foreground' : 'sr-only'}
          >
            {description}
          </DialogDescription>
        </DialogHeader>
        {children && (
          <div className={cn('flex-1 overflow-y-auto', hasBorder && 'px-5')}>{children}</div>
        )}
        {!disableFooter && (
          <DialogFooter
            className={cn(
              'flex flex-row! justify-end items-center gap-2 mt-auto',
              hasBorder && 'px-5 pb-5',
            )}
          >
            <Button
              suppressHydrationWarning
              className="w-auto"
              variant={'outline'}
              onClick={handleClose}
              disabled={isPending || busy}
              autoFocus={false}
            >
              {t('button.close')}
            </Button>
            <Button
              suppressHydrationWarning
              className="w-auto"
              variant={'destructive'}
              onClick={handleAccept}
              type="submit"
              form={id}
              disabled={isAcceptDisabled}
              autoFocus={false}
            >
              {t('button.accept')}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </DialogRoot>
  );
};

export default Dialog;
