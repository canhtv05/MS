'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/animate-ui/components/buttons/button';
import { ColorPicker } from './ColorPicker';
import { Stars } from '@solar-icons/react-perf/BoldDuotone';

// Social media platform color palette - default color
const DEFAULT_COLOR = '#4ECDC4';

interface ICreateInterestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string, color: string) => void;
}

export const CreateInterestDialog = ({ isOpen, onClose, onCreate }: ICreateInterestDialogProps) => {
  const { t } = useTranslation('profile');
  const [title, setTitle] = useState('');
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [error, setError] = useState('');

  // Reset form when dialog opens
  useEffect(() => {
    if (!isOpen) return;

    // Use setTimeout to avoid synchronous state updates in effect
    const timer = setTimeout(() => {
      setTitle('');
      setColor(DEFAULT_COLOR);
      setError('');
    }, 0);

    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleCreate = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError(t('profile:interest_title_required', 'Interest title is required'));
      return;
    }

    if (trimmedTitle.length > 50) {
      setError(
        t('profile:interest_title_too_long', 'Interest title must be less than 50 characters'),
      );
      return;
    }

    onCreate(trimmedTitle, color);
    onClose();
  };

  const handleClose = () => {
    setTitle('');
    setColor(DEFAULT_COLOR);
    setError('');
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      title={t('profile:create_custom_interest', 'Create Custom Interest')}
      description={t(
        'profile:create_custom_interest_description',
        'Add a personalized interest with your own title and color',
      )}
      size="md"
      disableFooter
    >
      <div className="space-y-4 py-4 px-1">
        <div>
          <Input
            label={t('profile:interest_title', 'Interest Title')}
            value={title}
            onChange={e => {
              setTitle(e.target.value);
              setError('');
            }}
            placeholder={t('profile:enter_interest_title', 'Enter interest title...')}
            validate={!!error}
            errorText={error}
            maxLength={50}
            autoFocus
            id="interest_title"
            icon={<Stars className="size-4 pl-1" />}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {title.length}/50 {t('profile:characters', 'characters')}
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground/70 mb-2 block">
            {t('profile:choose_color', 'Choose Color')}
          </label>
          <ColorPicker selectedColor={color} onColorChange={setColor} />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={handleClose}>
          {t('common:button.cancel', 'Cancel')}
        </Button>
        <Button onClick={handleCreate} disabled={!title.trim()}>
          {t('profile:create_interest', 'Create Interest')}
        </Button>
      </div>
    </Dialog>
  );
};
