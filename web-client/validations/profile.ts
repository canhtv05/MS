'use client';

import { z } from 'zod/v4';
import i18next from 'i18next';

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
});
