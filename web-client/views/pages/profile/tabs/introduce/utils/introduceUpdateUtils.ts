import { IDetailUserProfileDTO, IUpdateProfileIntroduceDTO } from '@/types/profile';
import { updateUserProfileIntroduceSchema } from '@/validations/profile';
import { z } from 'zod/v4';
import { Gender, RelationshipStatus } from '@/enums/common';
import { TIntroduceField } from './fieldUtils';

type UpdateIntroduceSchemaValues = z.infer<typeof updateUserProfileIntroduceSchema>;

export const buildIntroduceUpdatePayload = (
  introduce: IDetailUserProfileDTO['introduce'] | undefined,
  field: TIntroduceField,
  value: string,
): IUpdateProfileIntroduceDTO => {
  const base: UpdateIntroduceSchemaValues = {
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
    dob: introduce?.dob ? new Date(introduce.dob) : new Date(),
    gender: introduce?.gender ?? Gender.GENDER_OTHER,
    relationshipStatus:
      introduce?.relationshipStatus ?? RelationshipStatus.RELATIONSHIP_STATUS_SINGLE,
    phoneNumber: introduce?.phoneNumber ?? '',
  };

  switch (field) {
    case 'dob':
      base.dob = value ? new Date(value) : base.dob;
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

  const validated = updateUserProfileIntroduceSchema.parse(base);

  return {
    city: validated.city,
    hometown: validated.hometown,
    jobTitle: validated.jobTitle,
    company: validated.company,
    school: validated.school,
    websiteUrl: validated.websiteUrl ?? '',
    githubUrl: validated.githubUrl ?? '',
    linkedinUrl: validated.linkedinUrl ?? '',
    facebookUrl: validated.facebookUrl ?? '',
    instagramUrl: validated.instagramUrl ?? '',
    tiktokUrl: validated.tiktokUrl ?? '',
    xUrl: validated.xUrl ?? '',
    dob: validated.dob ? validated.dob.toLocaleDateString() : '',
    gender: validated.gender ?? Gender.GENDER_OTHER,
    relationshipStatus:
      validated.relationshipStatus ?? RelationshipStatus.RELATIONSHIP_STATUS_SINGLE,
    phoneNumber: validated.phoneNumber,
    interests: introduce?.interests?.map(i => i.id) ?? [],
  };
};
