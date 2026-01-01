'use client';

import {
  Dialog as DialogAnimate,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogTitle,
} from '@/components/animate-ui/components/headless/dialog';
import { Button } from '../animate-ui/components/buttons/button';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { ReactNode, useCallback, useEffect } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';

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
}

const sizeClasses: Record<DialogSize, string> = {
  sm: 'max-w-sm! w-[calc(100%-2rem)] md:w-full h-[calc(100%-28px)] rounded-lg',
  md: 'max-w-lg! w-[calc(100%-2rem)] md:w-full h-[calc(100%-28px)] rounded-lg',
  lg: 'max-w-2xl! w-[calc(100%-2rem)] md:w-full h-[calc(100%-28px)] rounded-lg',
  xl: 'max-w-4xl! w-[calc(100%-2rem)] md:w-full h-[calc(100%-28px)] rounded-lg',
  full: 'max-w-[90vw]! w-[calc(100%-2rem)] md:w-full h-[calc(100%-28px)] rounded-lg',
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
}: IDialog<T>) => {
  const { t } = useTranslation();

  const handleClose = useCallback(() => {
    if (isPending) return;
    onClose?.();
  }, [onClose, isPending]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isPending) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClose, isPending]);

  const isAcceptDisabled = isPending || (form ? !form.formState.isValid : disableAccept);

  return (
    <DialogAnimate open={open} onClose={handleClose}>
      <DialogPanel className={cn(sizeClasses[size], 'flex flex-col')}>
        <DialogHeader>
          <DialogTitle className="flex items-start justify-center w-full flex-col gap-1">
            {title}
            {titleNode}
          </DialogTitle>
          <DialogDescription className={description ? 'text-muted-foreground' : 'sr-only'}>
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">{children}</div>
        {!disableFooter && (
          <DialogFooter className="flex flex-row! justify-end items-center gap-2 mt-auto">
            <Button
              className="w-auto"
              variant={'outline'}
              onClick={handleClose}
              disabled={isPending}
            >
              {t('button.close')}
            </Button>
            <Button
              className="w-auto"
              variant={'destructive'}
              onClick={() => {
                onAccept?.();
              }}
              type="submit"
              form={id}
              disabled={isAcceptDisabled}
            >
              {t('button.accept')}
            </Button>
          </DialogFooter>
        )}
      </DialogPanel>
    </DialogAnimate>
  );
};

export default Dialog;
