'use client';

import { TIntroduceField } from '../utils/fieldUtils';
import { getFieldIcon } from '../utils/fieldUtils';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

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
        'group hover:bg-muted/40 rounded-lg',
        '-mx-3 transition-all duration-200',
        'border border-transparent hover:border-muted/50',
      )}
    >
      {renderIcon(
        IconComponent,
        'size-5 text-foreground/50 shrink-0 group-hover:text-foreground/70 transition-colors mt-0.5',
      )}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <span className="text-xs font-medium text-foreground/60 leading-tight">{t(labelKey)}</span>
        <span className="text-sm text-foreground/90 leading-relaxed wrap-break-word">{value}</span>
      </div>
      {onEdit && (
        <button
          onClick={onEdit}
          className={cn(
            'opacity-0 group-hover:opacity-100 transition-all duration-200',
            'p-2 rounded-md hover:bg-muted/60',
            'hover:text-primary cursor-pointer',
            'shrink-0 mt-0.5',
            'active:scale-95',
            'min-w-[32px] min-h-[32px] flex items-center justify-center',
          )}
          title="Edit"
        >
          <svg
            className="size-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
      )}
    </div>
  );
};
