'use client';

import { useState } from 'react';
import { IDetailUserProfileDTO } from '@/types/profile';
import { TIntroduceField } from '../utils/fieldUtils';
import { useTranslation } from 'react-i18next';
import EditIntroduce from '../components/EditIntroduce';

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
    <div className="flex flex-col gap-1">
      <EditIntroduce
        fields={BASIC_INFO_FIELDS}
        introduce={introduce}
        t={t}
        editingField={editingField}
        editValues={editValues}
        handleSaveEdit={handleSaveEdit}
        handleCancelEdit={handleCancelEdit}
        handleStartEdit={handleStartEdit}
        isOwner={isOwner}
      />
    </div>
  );
};
