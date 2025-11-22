'use client';

import { z } from 'zod/v4';
import i18next from 'i18next';

const t = i18next.t;

export const signInSchema = z.object({
  username: z
    .string()
    .min(3, t('validation:required', { field: t('auth:sign_in.label_email_or_username') })),
  password: z.string().min(3, t('validation:required', { field: t('auth:sign_in.password') })),
});

export const signUpSchema = z
  .object({
    fullname: z.string().min(3, t('validation:required', { field: t('auth:sign_up.full_name') })),
    username: z.string().min(3, t('validation:required', { field: t('auth:sign_up.username') })),
    email: z.email(t('validation:required', { field: t('auth:sign_up.email') })),
    password: z.string().min(3, t('validation:required', { field: t('auth:sign_up.password') })),
    confirmPassword: z
      .string()
      .min(3, t('validation:required', { field: t('auth:sign_up.confirm_password') })),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: t('validation:sign_up.password_not_match'),
    path: ['confirmPassword'],
  });
