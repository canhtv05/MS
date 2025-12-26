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
import { useCallback, useEffect } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';

type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface IDialog<T extends FieldValues = FieldValues> {
  children?: React.ReactNode;
  onAccept?: () => void;
  onClose?: () => void;
  title: string;
  description?: string;
  open: boolean;
  id?: string;
  size?: DialogSize;
  disableAccept?: boolean;
  form?: UseFormReturn<T>;
  disableFooter?: boolean;
}

const sizeClasses: Record<DialogSize, string> = {
  sm: 'sm:max-w-sm sm:h-auto max-w-full h-full',
  md: 'sm:max-w-lg sm:h-auto max-w-full h-full',
  lg: 'sm:max-w-2xl sm:h-auto max-w-full h-full',
  xl: 'sm:max-w-4xl sm:h-auto max-w-full h-full',
  full: 'sm:max-w-[90vw] sm:h-auto max-w-full h-full',
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
}: IDialog<T>) => {
  const { t } = useTranslation();

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClose]);

  const isAcceptDisabled = form ? !form.formState.isValid : disableAccept;

  return (
    <DialogAnimate open={open} onClose={handleClose}>
      <DialogPanel className={cn(sizeClasses[size])}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className={!!description ? 'block' : 'hidden'}>
            {description}
          </DialogDescription>
        </DialogHeader>
        {children}
        {!disableFooter && (
          <DialogFooter className="flex flex-row! justify-end items-center gap-2">
            <Button className="w-auto" variant={'outline'} onClick={handleClose}>
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
