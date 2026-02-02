'use client';

import { useState } from 'react';
import { IDetailUserProfileDTO } from '@/types/profile';
import { FieldItem } from '../components/FieldItem';
import { EditField } from '../components/EditField';
import { getFieldValue, formatFieldValue, getLabelKey, TIntroduceField } from '../utils/fieldUtils';
import { useTranslation } from 'react-i18next';

interface IBasicInfoTabProps {
  data?: IDetailUserProfileDTO;
  isOwner?: boolean;
}

const BASIC_INFO_FIELDS: TIntroduceField[] = [
  'dob',
  'gender',
  'relationship_status',
  'hometown',
  'city',
];

export const BasicInfoTab = ({ data, isOwner = false }: IBasicInfoTabProps) => {
  const { t } = useTranslation('profile');
  const introduce = data?.introduce;
  const [editingField, setEditingField] = useState<TIntroduceField | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  const handleStartEdit = (field: TIntroduceField, currentValue: string) => {
    setEditingField(field);
    setEditValues(prev => ({ ...prev, [field]: currentValue }));
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValues({});
  };

  const handleSaveEdit = async (field: TIntroduceField, value: string) => {
    // TODO: Implement API call to save the field
    console.log('Saving field:', field, 'with value:', value);
    setEditingField(null);
    setEditValues({});
    // After successful save, you might want to update the data prop or refetch
  };

  return (
    <div className="flex flex-col gap-1 p-1">
      {BASIC_INFO_FIELDS.map(field => {
        const rawValue = getFieldValue(field, introduce);
        const displayValue = formatFieldValue(field, rawValue, t);
        const labelKey = getLabelKey(field);
        const isEditing = editingField === field;
        const editValue = editValues[field] ?? rawValue;

        if (!rawValue) return null;

        if (isEditing) {
          return (
            <div key={field} className="px-3 py-2">
              <EditField
                field={field}
                value={editValue}
                labelKey={labelKey}
                onSave={value => handleSaveEdit(field, value)}
                onCancel={handleCancelEdit}
              />
            </div>
          );
        }

        return (
          <FieldItem
            key={field}
            field={field}
            value={displayValue}
            labelKey={labelKey}
            onEdit={isOwner ? () => handleStartEdit(field, rawValue) : undefined}
          />
        );
      })}
    </div>
  );
};
