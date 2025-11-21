'use client';

import { z } from 'zod/v4';
import i18next from 'i18next';

const t = i18next.t;

export const signInSchema = z.object({
  username: z
    .string()
    .min(2, t('validation:required', { field: t('auth:sign_in.label_email_or_username') })),
  password: z.string().min(2, t('validation:required', { field: t('auth:sign_in.password') })),
});
