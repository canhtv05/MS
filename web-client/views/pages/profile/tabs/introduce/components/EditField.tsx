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
      <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
        <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
          {renderIcon(IconComponent, 'size-4 text-foreground/60 shrink-0')}
          <span>{t(labelKey)}</span>
        </label>
        <div className="flex items-center gap-2.5">
          <div className="flex-1">
            <Select value={editValue} onValueChange={setEditValue}>
              <SelectTrigger
                className={cn(
                  'w-full transition-all duration-200',
                  'border-gray-200 dark:border-gray-800',
                  'bg-background hover:bg-muted/50',
                  'cursor-pointer',
                  'h-11 px-3',
                  'focus:ring-2 focus:ring-primary/20 focus:border-primary',
                  'shadow-sm',
                )}
              >
                <div className="flex items-center gap-2.5 w-full">
                  {renderIcon(IconComponent, 'size-4 text-foreground/60 shrink-0')}
                  <SelectValue className="flex-1 text-left">
                    <span className="text-foreground text-sm">
                      {formatFieldValue(field, editValue, t)}
                    </span>
                  </SelectValue>
                </div>
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
          <button
            onClick={handleSave}
            className={cn(
              'p-2.5 rounded-lg transition-all duration-200',
              'bg-primary hover:bg-primary/90 text-primary-foreground',
              'shadow-sm hover:shadow-md active:scale-95',
              'cursor-pointer shrink-0',
              'flex items-center justify-center',
              'min-w-[44px] min-h-[44px]',
            )}
            title="Save (Enter)"
          >
            <CheckRead className="size-4" />
          </button>
          <button
            onClick={onCancel}
            className={cn(
              'p-2.5 rounded-lg transition-all duration-200',
              'bg-muted hover:bg-muted/80 text-foreground/70',
              'hover:text-foreground',
              'cursor-pointer shrink-0',
              'flex items-center justify-center',
              'active:scale-95',
              'min-w-[44px] min-h-[44px]',
            )}
            title="Cancel (Esc)"
          >
            <CloseCircle className="size-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
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
            icon={
              IconComponent
                ? renderIcon(IconComponent, 'size-5 text-foreground/60 stroke-2')
                : undefined
            }
            className={cn(
              'bg-background hover:bg-muted/50 transition-all duration-200 w-full',
              'focus:ring-2 focus:ring-primary/20 focus:border-primary',
              'shadow-sm',
            )}
          />
        </div>
        <button
          onClick={handleSave}
          className={cn(
            'p-2.5 rounded-lg transition-all duration-200',
            'bg-primary hover:bg-primary/90 text-primary-foreground',
            'shadow-sm hover:shadow-md active:scale-95',
            'cursor-pointer shrink-0',
            'flex items-center justify-center',
            'min-w-[44px] min-h-[44px]',
          )}
          title="Save (Enter)"
        >
          <CheckRead className="size-4" />
        </button>
        <button
          onClick={onCancel}
          className={cn(
            'p-2.5 rounded-lg transition-all duration-200',
            'bg-muted hover:bg-muted/80 text-foreground/70',
            'hover:text-foreground',
            'cursor-pointer shrink-0',
            'flex items-center justify-center',
            'active:scale-95',
            'min-w-[44px] min-h-[44px]',
          )}
          title="Cancel (Esc)"
        >
          <CloseCircle className="size-4" />
        </button>
      </div>
    </div>
  );
};
