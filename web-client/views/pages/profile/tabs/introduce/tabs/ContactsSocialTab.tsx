'use client';

import { useState } from 'react';
import { IDetailUserProfileDTO } from '@/types/profile';
import { TIntroduceField } from '../utils/fieldUtils';
import { useTranslation } from 'react-i18next';
import EditIntroduce from '../components/EditIntroduce';
import { useProfileMutation } from '@/services/mutations/profile';
import { buildIntroduceUpdatePayload } from '../utils/introduceUpdateUtils';

interface IContactsSocialTabProps {
  data?: IDetailUserProfileDTO;
  isOwner?: boolean;
}

const CONTACTS_SOCIAL_FIELDS: TIntroduceField[] = [
  'phone_number',
  'website_url',
  'facebook_url',
  'github_url',
  'linkedin_url',
  'instagram_url',
  'tiktok_url',
  'x_url',
];

export const ContactsSocialTab = ({ data, isOwner = false }: IContactsSocialTabProps) => {
  const { t } = useTranslation('profile');
  const introduce = data?.introduce;
  const [editingField, setEditingField] = useState<TIntroduceField | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const { updateUserProfileIntroduceMutation } = useProfileMutation();

  const handleStartEdit = (field: TIntroduceField, currentValue: string) => {
    setEditingField(field);
    setEditValues(prev => ({ ...prev, [field]: currentValue }));
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValues({});
  };

  const handleSaveEdit = async (field: TIntroduceField, value: string) => {
    const payload = buildIntroduceUpdatePayload(introduce, field, value);
    updateUserProfileIntroduceMutation.mutateAsync(payload, {
      onSuccess: () => {
        setEditingField(null);
        setEditValues({});
      },
    });
  };

  return (
    <div className="flex flex-col gap-1">
      <EditIntroduce
        fields={CONTACTS_SOCIAL_FIELDS}
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
