'use client';

import { TIntroduceField } from '../TabIntroduce';
import { formatFieldValue, getFieldValue, getLabelKey } from '../utils/fieldUtils';
import { IDetailUserProfileDTO } from '@/types/profile';
import { TFunction } from 'i18next';
import { EditField } from './EditField';
import { FieldItem } from './FieldItem';

interface IEditIntroduceProps {
  fields: TIntroduceField[];
  introduce?: IDetailUserProfileDTO['introduce'];
  t: TFunction<['profile'], string>;
  editingField: TIntroduceField | null;
  editValues: Record<string, string>;
  handleSaveEdit: (field: TIntroduceField, value: string) => void;
  handleCancelEdit: () => void;
  handleStartEdit: (field: TIntroduceField, value: string) => void;
  isOwner: boolean;
}

const EditIntroduce = ({
  fields,
  introduce,
  t,
  editingField,
  editValues,
  handleSaveEdit,
  handleCancelEdit,
  handleStartEdit,
  isOwner,
}: IEditIntroduceProps) => {
  return (
    <>
      {fields.map(field => {
        const rawValue = getFieldValue(field, introduce);
        const displayValue = formatFieldValue(field, rawValue, t);
        const labelKey = getLabelKey(field);
        const isEditing = editingField === field;
        const editValue = editValues[field] ?? rawValue;

        if (!rawValue && !isOwner) return null;

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
    </>
  );
};

export default EditIntroduce;
