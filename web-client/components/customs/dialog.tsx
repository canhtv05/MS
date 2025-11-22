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

interface IDialog {
  children?: React.ReactNode;
  onAccept?: () => void;
  onClose?: () => void;
  title: string;
  description: string;
  open: boolean;
  id?: string;
}

const Dialog = ({ children, open, onAccept, onClose, title, description, id }: IDialog) => {
  const { t } = useTranslation();

  return (
    <DialogAnimate open={open} onClose={() => onClose?.()}>
      <DialogPanel>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter className="flex justify-end items-center gap-2">
          <Button variant={'outline'} onClick={onClose}>
            {t('button.close')}
          </Button>
          <Button
            variant={'destructive'}
            onClick={() => {
              onAccept?.();
            }}
            type="submit"
            form={id}
          >
            {t('button.accept')}
          </Button>
        </DialogFooter>
      </DialogPanel>
    </DialogAnimate>
  );
};

export default Dialog;
