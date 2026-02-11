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
import { AltArrowDown, CheckRead } from '@solar-icons/react-perf/Outline';
import { IconButton } from '@/components/animate-ui/components/buttons/icon';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverTrigger,
  PopoverPortal,
  PopoverPositioner,
  PopoverPopup,
} from '@/components/animate-ui/primitives/base/popover';
import { XIcon } from '@/components/animate-ui/icons';

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
  const [dobOpen, setDobOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const IconComponent = getFieldIcon(field);

  useEffect(() => {
    if (inputRef.current && !isEnumField(field)) {
      inputRef.current.focus();
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

  if (field === 'dob') {
    const dobDate = editValue ? new Date(editValue) : undefined;
    const displayDob =
      editValue && dobDate instanceof Date && !Number.isNaN(dobDate.getTime())
        ? formatFieldValue(field, editValue, t)
        : t('profile:introduce.placeholders.dob', 'Select date');

    return (
      <div className="flex flex-col gap-3">
        <Label htmlFor={`edit-field-${field}`}>
          {renderIcon(IconComponent, 'size-4 text-foreground/60 shrink-0')}
          <span>{t(labelKey)}</span>
        </Label>
        <div className="flex items-center gap-2.5">
          <div className="flex-1">
            <Popover modal={false} open={dobOpen} onOpenChange={setDobOpen}>
              <PopoverTrigger
                className={cn(
                  'flex h-10 w-full items-center justify-between rounded-md border border-input',
                  'bg-transparent px-3 text-sm text-foreground cursor-pointer',
                )}
              >
                <span className={cn(!editValue && 'text-muted-foreground')}>{displayDob}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  <AltArrowDown className="size-4" />
                </span>
              </PopoverTrigger>
              <PopoverPortal>
                <PopoverPositioner align="end" sideOffset={4}>
                  <PopoverPopup
                    initial={{ opacity: 0, y: -4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -2, scale: 0.98 }}
                    transition={{
                      type: 'tween',
                      duration: 0.15,
                      ease: 'easeOut',
                    }}
                    className="mt-2 rounded-md border border-input bg-popover p-1"
                  >
                    <Calendar
                      mode="single"
                      selected={dobDate}
                      captionLayout="dropdown"
                      className="bg-popover"
                      defaultMonth={dobDate}
                      onSelect={date => {
                        if (date) {
                          setEditValue(date.toLocaleDateString());
                          setDobOpen(false);
                        }
                      }}
                    />
                  </PopoverPopup>
                </PopoverPositioner>
              </PopoverPortal>
            </Popover>
          </div>
          <IconButton
            onClick={handleSave}
            className={cn('bg-primary hover:bg-primary/90 text-white', 'shadow-sm hover:shadow-md')}
            title={t('common:button.save')}
          >
            <CheckRead className="size-4" />
          </IconButton>
          <IconButton
            onClick={onCancel}
            className={cn('bg-muted hover:bg-muted/80 text-foreground/80', 'hover:text-foreground')}
            title={t('common:button.cancel')}
            variant="outline"
          >
            <XIcon className="size-4" />
          </IconButton>
        </div>
      </div>
    );
  }

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
              <SelectTrigger className={cn('bg-transparent!')}>
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
            className={cn('bg-primary hover:bg-primary/90 text-white', 'shadow-sm hover:shadow-md')}
            title={t('common:button.save')}
          >
            <CheckRead className="size-4" />
          </IconButton>
          <IconButton
            onClick={onCancel}
            className={cn('bg-muted hover:bg-muted/80 text-foreground/80', 'hover:text-foreground')}
            title={t('common:button.cancel')}
            variant="outline"
          >
            <XIcon className="size-4" />
          </IconButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor={`edit-field-${field}`}>
        {renderIcon(IconComponent, 'size-4 text-foreground/60 shrink-0')}
        <span>{t(labelKey)}</span>
      </Label>
      <div className="flex items-center gap-2.5">
        <div className="flex-1">
          <Input
            id={`edit-field-${field}`}
            name={`edit-field-${field}`}
            ref={inputRef}
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn('bg-transparent!')}
          />
        </div>
        <IconButton
          onClick={handleSave}
          className={cn('bg-primary hover:bg-primary/90 text-white', 'shadow-sm hover:shadow-md')}
          title={t('common:button.save')}
        >
          <CheckRead className="size-4" />
        </IconButton>
        <IconButton onClick={onCancel} variant="outline" title={t('common:button.cancel')}>
          <div>
            <XIcon className="size-4" />
          </div>
        </IconButton>
      </div>
    </div>
  );
};
