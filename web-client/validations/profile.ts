'use client';

import { z } from 'zod/v4';
import i18next from 'i18next';
import { Gender, RelationshipStatus } from '@/enums/common';

const t = i18next.t;

const validDomain = (value: string | null | undefined, allowOrigins: string[]) => {
  if (!value || value.trim() === '') return true;
  try {
    const url = new URL(value);
    return allowOrigins.some(origin => url.hostname.includes(origin));
  } catch {
    return false;
  }
};

export const updateProfileSchema = z.object({
  bio: z.string().max(255, t('validation:string.max', { field: t('profile:bio'), max: 255 })),
  city: z.string().max(255, t('validation:string.max', { field: t('profile:city'), max: 255 })),
  hometown: z
    .string()
    .max(255, t('validation:string.max', { field: t('profile:hometown'), max: 255 })),
  jobTitle: z
    .string()
    .max(255, t('validation:string.max', { field: t('profile:jobTitle'), max: 255 })),
  company: z
    .string()
    .max(255, t('validation:string.max', { field: t('profile:company'), max: 255 })),
  school: z.string().max(255, t('validation:string.max', { field: t('profile:school'), max: 255 })),
  websiteUrl: z.string().optional().or(z.literal('')),
  githubUrl: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(
      value => validDomain(value, ['github.com', 'git.io']),
      t('validation:string.url', { field: t('profile:githubUrl') }),
    ),
  linkedinUrl: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(
      value => validDomain(value, ['linkedin.com', 'in.com']),
      t('validation:string.url', { field: t('profile:linkedinUrl') }),
    ),
  facebookUrl: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(
      value => validDomain(value, ['facebook.com', 'fb.com']),
      t('validation:string.url', { field: t('profile:facebookUrl') }),
    ),
  instagramUrl: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(
      value => validDomain(value, ['instagram.com', 'instagr.am', 'insta.co']),
      t('validation:string.url', { field: t('profile:instagramUrl') }),
    ),
  tiktokUrl: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(
      value => validDomain(value, ['tiktok.com', 'vm.tiktok.com']),
      t('validation:string.url', { field: t('profile:tiktokUrl') }),
    ),
  xUrl: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(
      value => validDomain(value, ['x.com', 'x.app']),
      t('validation:string.url', { field: t('profile:xUrl') }),
    ),
  dob: z.date().optional().default(new Date()),
  gender: z.enum(Gender).optional().default(Gender.GENDER_OTHER),
  relationshipStatus: z
    .enum(RelationshipStatus)
    .optional()
    .default(RelationshipStatus.RELATIONSHIP_STATUS_SINGLE),
  phoneNumber: z
    .string()
    .max(255, t('validation:string.max', { field: t('profile:phoneNumber'), max: 255 })),
  interests: z.array(z.string()).optional(),
});
