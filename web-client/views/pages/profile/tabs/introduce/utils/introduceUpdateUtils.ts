import { IDetailUserProfileDTO, IUpdateProfileIntroduceDTO } from '@/types/profile';
import { updateUserProfileIntroduceSchema } from '@/validations/profile';
import { z } from 'zod/v4';
import { Gender, RelationshipStatus } from '@/enums/common';
import { TIntroduceField } from './fieldUtils';
import { parseDateForSaving } from '@/lib/utils';

type UpdateIntroduceSchemaValues = z.infer<typeof updateUserProfileIntroduceSchema>;

const buildBaseValues = (
  introduce: IDetailUserProfileDTO['introduce'] | undefined,
): UpdateIntroduceSchemaValues => ({
  city: introduce?.city ?? '',
  hometown: introduce?.hometown ?? '',
  jobTitle: introduce?.jobTitle ?? '',
  company: introduce?.company ?? '',
  school: introduce?.school ?? '',
  websiteUrl: introduce?.websiteUrl ?? '',
  githubUrl: introduce?.githubUrl ?? '',
  linkedinUrl: introduce?.linkedinUrl ?? '',
  facebookUrl: introduce?.facebookUrl ?? '',
  instagramUrl: introduce?.instagramUrl ?? '',
  tiktokUrl: introduce?.tiktokUrl ?? '',
  xUrl: introduce?.xUrl ?? '',
  dob: introduce?.dob ? parseDateForSaving(introduce.dob) : '',
  gender: introduce?.gender ?? Gender.GENDER_OTHER,
  relationshipStatus:
    introduce?.relationshipStatus ?? RelationshipStatus.RELATIONSHIP_STATUS_SINGLE,
  phoneNumber: introduce?.phoneNumber ?? '',
});

const applyFieldValue = (
  base: UpdateIntroduceSchemaValues,
  field: TIntroduceField,
  value: string,
): void => {
  switch (field) {
    case 'dob':
      base.dob = value ? parseDateForSaving(value) : base.dob;
      break;
    case 'gender':
      base.gender = value as Gender;
      break;
    case 'relationship_status':
      base.relationshipStatus = value as RelationshipStatus;
      break;
    case 'hometown':
      base.hometown = value;
      break;
    case 'city':
      base.city = value;
      break;
    case 'school':
      base.school = value;
      break;
    case 'job_title':
      base.jobTitle = value;
      break;
    case 'company':
      base.company = value;
      break;
    case 'phone_number':
      base.phoneNumber = value;
      break;
    case 'website_url':
      base.websiteUrl = value;
      break;
    case 'facebook_url':
      base.facebookUrl = value;
      break;
    case 'github_url':
      base.githubUrl = value;
      break;
    case 'linkedin_url':
      base.linkedinUrl = value;
      break;
    case 'instagram_url':
      base.instagramUrl = value;
      break;
    case 'tiktok_url':
      base.tiktokUrl = value;
      break;
    case 'x_url':
      base.xUrl = value;
      break;
    default:
      break;
  }
};

const schemaKeyByField: Record<
  Exclude<TIntroduceField, 'interests'>,
  keyof UpdateIntroduceSchemaValues
> = {
  dob: 'dob',
  gender: 'gender',
  relationship_status: 'relationshipStatus',
  hometown: 'hometown',
  city: 'city',
  school: 'school',
  job_title: 'jobTitle',
  company: 'company',
  phone_number: 'phoneNumber',
  website_url: 'websiteUrl',
  facebook_url: 'facebookUrl',
  github_url: 'githubUrl',
  linkedin_url: 'linkedinUrl',
  instagram_url: 'instagramUrl',
  tiktok_url: 'tiktokUrl',
  x_url: 'xUrl',
};

export const validateIntroduceField = (
  introduce: IDetailUserProfileDTO['introduce'] | undefined,
  field: TIntroduceField,
  value: string,
): string | null => {
  if (field === 'interests') {
    return null;
  }

  const base = buildBaseValues(introduce);
  applyFieldValue(base, field, value);

  try {
    updateUserProfileIntroduceSchema.parse(base);
    return null;
  } catch (err) {
    if (err instanceof z.ZodError) {
      const schemaKey = schemaKeyByField[field as Exclude<TIntroduceField, 'interests'>];
      const issueForField = err.issues.find(issue => issue.path[0] === schemaKey);
      return issueForField?.message ?? null;
    }
    return null;
  }
};

export const buildIntroduceUpdatePayload = (
  introduce: IDetailUserProfileDTO['introduce'] | undefined,
  field: TIntroduceField,
  value: string,
): Partial<IUpdateProfileIntroduceDTO> => {
  const base = buildBaseValues(introduce);
  applyFieldValue(base, field, value);
  const validated = updateUserProfileIntroduceSchema.parse(base);
  const payload: Partial<IUpdateProfileIntroduceDTO> = {};

  switch (field) {
    case 'city':
      payload.city = validated.city;
      break;
    case 'hometown':
      payload.hometown = validated.hometown;
      break;
    case 'job_title':
      payload.jobTitle = validated.jobTitle;
      break;
    case 'company':
      payload.company = validated.company;
      break;
    case 'school':
      payload.school = validated.school;
      break;
    case 'phone_number':
      payload.phoneNumber = validated.phoneNumber;
      break;
    case 'website_url':
      payload.websiteUrl = validated.websiteUrl ?? '';
      break;
    case 'github_url':
      payload.githubUrl = validated.githubUrl ?? '';
      break;
    case 'linkedin_url':
      payload.linkedinUrl = validated.linkedinUrl ?? '';
      break;
    case 'facebook_url':
      payload.facebookUrl = validated.facebookUrl ?? '';
      break;
    case 'instagram_url':
      payload.instagramUrl = validated.instagramUrl ?? '';
      break;
    case 'tiktok_url':
      payload.tiktokUrl = validated.tiktokUrl ?? '';
      break;
    case 'x_url':
      payload.xUrl = validated.xUrl ?? '';
      break;
    case 'dob':
      payload.dob = validated.dob ? parseDateForSaving(validated.dob) : '';
      break;
    case 'gender':
      payload.gender = validated.gender ?? Gender.GENDER_OTHER;
      break;
    case 'relationship_status':
      payload.relationshipStatus =
        validated.relationshipStatus ?? RelationshipStatus.RELATIONSHIP_STATUS_SINGLE;
      break;
    default:
      break;
  }

  return payload;
};
