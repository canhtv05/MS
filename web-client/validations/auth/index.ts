'use client';

import { z } from 'zod/v4';
import i18next from 'i18next';

const t = i18next.t;

export const signInSchema = z.object({
  username: z
    .string()
    .min(
      3,
      t('validation:string.min', { field: t('auth:sign_in.label_email_or_username'), min: 3 }),
    ),
  password: z
    .string()
    .min(3, t('validation:string.min', { field: t('auth:sign_in.password'), min: 3 })),
});

export const signUpSchema = z
  .object({
    fullname: z
      .string()
      .min(3, t('validation:string.min', { field: t('auth:sign_up.full_name'), min: 3 })),
    username: z
      .string()
      .min(3, t('validation:string.min', { field: t('auth:sign_up.username'), min: 3 })),
    email: z.email(t('validation:string.email', { field: t('auth:sign_up.email'), min: 3 })),
    password: z
      .string()
      .min(3, t('validation:string.min', { field: t('auth:sign_up.password'), min: 3 })),
    confirmPassword: z
      .string()
      .min(3, t('validation:string.min', { field: t('auth:sign_up.confirm_password'), min: 3 })),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: t('validation:sign_up.password_not_match'),
    path: ['confirmPassword'],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(
        3,
        t('validation:string.min', { field: t('auth:change_password.current_password'), min: 3 }),
      ),
    newPassword: z
      .string()
      .min(
        3,
        t('validation:string.min', { field: t('auth:change_password.new_password'), min: 3 }),
      ),
    confirmPassword: z
      .string()
      .min(
        3,
        t('validation:string.min', { field: t('auth:change_password.confirm_password'), min: 3 }),
      ),
  })
  .refine(
    data => data.currentPassword && data.newPassword && data.currentPassword !== data.newPassword,
    {
      message: t('auth:change_password.password_new_cannot_be_same_as_old'),
      path: ['newPassword'],
    },
  )
  .refine(data => data.newPassword === data.confirmPassword, {
    message: t('auth:change_password.password_not_match'),
    path: ['confirmPassword'],
  });
