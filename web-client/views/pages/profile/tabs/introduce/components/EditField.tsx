'use client';

import { useState, useEffect, useRef } from 'react';
import { TIntroduceField, formatFieldValue, getFieldIcon, isEnumField } from '../utils/fieldUtils';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectArrow,
} from '@/components/animate-ui/components/radix/select';
import { Gender, RelationshipStatus } from '@/enums/common';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { CheckRead, CloseCircle } from '@solar-icons/react-perf/Outline';
import { IconButton } from '@/components/animate-ui/components/buttons/icon';

interface IEditFieldProps {
  field: TIntroduceField;
  value: string;
  labelKey: string;
  onSave: (value: string) => void;
  onCancel: () => void;
}

const renderIcon = (
  IconComponent: React.ComponentType<{ className?: string }> | null,
  className: string,
) => {
  if (!IconComponent) return null;
  return <IconComponent className={className} />;
};

export const EditField = ({ field, value, labelKey, onSave, onCancel }: IEditFieldProps) => {
  const { t } = useTranslation('profile');
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const IconComponent = getFieldIcon(field);

  useEffect(() => {
    // Auto focus input when component mounts
    if (inputRef.current && !isEnumField(field)) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [field]);

  const handleSave = () => {
    onSave(editValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  if (isEnumField(field)) {
    const enumValues =
      field === 'gender'
        ? Object.values(Gender).filter(v => v !== Gender.GENDER_UNSPECIFIED)
        : Object.values(RelationshipStatus).filter(
            v =>
              v !== RelationshipStatus.RELATIONSHIP_STATUS_UNSPECIFIED &&
              v !== RelationshipStatus.RELATIONSHIP_STATUS_HIDDEN,
          );

    return (
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
          {renderIcon(IconComponent, 'size-4 text-foreground/60 shrink-0')}
          <span>{t(labelKey)}</span>
        </label>
        <div className="flex items-center gap-2.5">
          <div className="flex-1">
            <Select value={editValue} onValueChange={setEditValue}>
              <SelectTrigger
                className={cn(
                  'w-full transition-colors duration-200',
                  'border-gray-200 dark:border-gray-800',
                  'bg-background hover:bg-muted/50',
                  'cursor-pointer',
                  'h-11 px-3',
                  'focus:ring-2 focus:ring-primary/20 focus:border-primary',
                  'shadow-sm',
                )}
              >
                <SelectValue className="flex-1 text-left">
                  <span className="text-foreground text-sm">
                    {formatFieldValue(field, editValue, t)}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectArrow />
                <SelectGroup>
                  {enumValues.map(val => (
                    <SelectItem key={val} value={val}>
                      {t(`common:${field === 'gender' ? 'gender' : 'relationship_status'}.${val}`)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <IconButton
            onClick={handleSave}
            className={cn(
              'transition-colors duration-200',
              'bg-primary hover:bg-primary/90 text-white',
              'shadow-sm hover:shadow-md active:scale-95',
            )}
            title={t('common:button.save')}
          >
            <CheckRead className="size-4" />
          </IconButton>
          <IconButton
            onClick={onCancel}
            className={cn(
              'transition-colors duration-200',
              'bg-muted hover:bg-muted/80 text-foreground/80',
              'hover:text-foreground active:scale-95',
            )}
            title={t('common:button.cancel')}
            variant="outline"
          >
            <CloseCircle className="size-4" />
          </IconButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
        {renderIcon(IconComponent, 'size-4 text-foreground/60 shrink-0')}
        <span>{t(labelKey)}</span>
      </label>
      <div className="flex items-center gap-2.5">
        <div className="flex-1">
          <Input
            ref={inputRef}
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(
              'bg-background hover:bg-muted/50 transition-colors duration-200 w-full',
              'focus:ring-2 focus:ring-primary/20 focus:border-primary',
              'shadow-sm',
            )}
          />
        </div>
        <IconButton
          onClick={handleSave}
          className={cn(
            'transition-colors duration-200',
            'bg-primary hover:bg-primary/90 text-white',
            'shadow-sm hover:shadow-md active:scale-95',
          )}
          title={t('common:button.save')}
        >
          <CheckRead className="size-4" />
        </IconButton>
        <IconButton
          onClick={onCancel}
          variant="outline"
          className={cn(
            'transition-colors duration-200',
            'bg-muted hover:bg-muted/80 text-foreground/80',
            'hover:text-foreground active:scale-95',
          )}
          title={t('common:button.cancel')}
        >
          <CloseCircle className="size-4" />
        </IconButton>
      </div>
    </div>
  );
};
