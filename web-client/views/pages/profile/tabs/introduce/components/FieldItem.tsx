'use client';

import { TIntroduceField } from '../utils/fieldUtils';
import { getFieldIcon } from '../utils/fieldUtils';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { PenNewSquare } from '@solar-icons/react-perf/Outline';
import { IconButton } from '@/components/animate-ui/components/buttons/icon';

interface IFieldItemProps {
  field: TIntroduceField;
  value: string;
  labelKey: string;
  onEdit?: () => void;
}

const renderIcon = (
  IconComponent: React.ComponentType<{ className?: string }> | null,
  className: string,
) => {
  if (!IconComponent) return null;
  return <IconComponent className={className} />;
};

export const FieldItem = ({ field, value, labelKey, onEdit }: IFieldItemProps) => {
  const { t } = useTranslation('profile');
  const IconComponent = getFieldIcon(field);

  if (!value) return null;

  return (
    <div
      className={cn(
        'flex items-start gap-3 py-2.5 px-3',
        'group hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg',
        'border border-transparent hover:border-muted/50',
        'transition-colors duration-200',
      )}
    >
      {renderIcon(IconComponent, 'size-5 text-foreground/60 shrink-0 mt-0.5')}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <span className="text-xs font-medium text-foreground/60 leading-tight">{t(labelKey)}</span>
        <span className="text-sm text-foreground/90 leading-relaxed wrap-break-word">{value}</span>
      </div>
      {onEdit && (
        <IconButton
          variant="ghost"
          onClick={onEdit}
          className={cn(
            'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
            'hover:text-primary cursor-pointer',
            'shrink-0 mt-0.5',
          )}
          title={t('common:button.edit')}
        >
          <PenNewSquare className="size-4" />
        </IconButton>
      )}
    </div>
  );
};
