'use client';

import { useState } from 'react';
import { IDetailUserProfileDTO } from '@/types/profile';
import { FieldItem } from '../components/FieldItem';
import { EditField } from '../components/EditField';
import { getFieldValue, formatFieldValue, getLabelKey, TIntroduceField } from '../utils/fieldUtils';
import { useTranslation } from 'react-i18next';
import { useInterestInfiniteQuery } from '@/services/queries/profile';
import { hexToRgba } from '@/utils/common';

interface IInterestsTabProps {
  data?: IDetailUserProfileDTO;
  isOwner?: boolean;
}

const INTERESTS_FIELDS: TIntroduceField[] = ['interests'];

export const InterestsTab = ({ data, isOwner = false }: IInterestsTabProps) => {
  const { t } = useTranslation('profile');
  const introduce = data?.introduce;
  const [editingField, setEditingField] = useState<TIntroduceField | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const { data: interests } = useInterestInfiniteQuery();

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
  };

  return (
    <div className="flex flex-wrap gap-2 w-full">
      <div className="flex flex-wrap gap-2">
        {interests?.pages?.map(page =>
          page.data.data.map(interest => (
            <button
              key={interest.id}
              className="flex items-center border rounded-full p-1 px-2 gap-(--sp-layout)"
              style={{
                borderColor: interest.color,
                backgroundColor: hexToRgba(interest.color, 0.3),
              }}
            >
              <div
                className="size-2 rounded-full"
                style={{ backgroundColor: interest.color }}
              ></div>
              <span className="text-xs" style={{ color: interest.color }}>
                {interest.title}
              </span>
            </button>
          )),
        )}
      </div>

      <div className="w-full">
        {INTERESTS_FIELDS.map(field => {
          const rawValue = getFieldValue(field, introduce);
          const displayValue = formatFieldValue(field, rawValue, t);
          const labelKey = getLabelKey(field);
          const isEditing = editingField === field;
          const editValue = editValues[field] ?? rawValue;

          if (!rawValue) return null;

          if (isEditing) {
            return (
              <EditField
                key={field}
                field={field}
                value={editValue}
                labelKey={labelKey}
                onSave={value => handleSaveEdit(field, value)}
                onCancel={handleCancelEdit}
              />
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
    </div>
  );
};
