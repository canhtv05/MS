'use client';

import { updateProfileSchema } from '@/validations/profile';
import Link from 'next/link';
import { z } from 'zod/v4';
import { AddSquare } from '@solar-icons/react-perf/Outline';
import { useTranslation } from 'react-i18next';

export type UpdateProfileFormValues = z.input<typeof updateProfileSchema>;

const IntroduceContent = () => {
  const { t } = useTranslation('profile');

  const INTRODUCE_FIELDS = [
    {
      label: t('province_city_current'),
      children: [
        {
          label: t('add_city'),
          url: '/profile/introduce/city',
        },
        {
          label: t('add_hometown'),
          url: '/profile/introduce/hometown',
        },
      ],
    },
    {
      label: t('career'),
      children: [
        {
          label: t('add_career'),
          url: '/profile/introduce/jobTitle',
        },
        {
          label: t('add_company'),
          url: '/profile/introduce/company',
        },
      ],
    },
    {
      label: t('school_label'),
      children: [
        {
          label: t('add_school'),
          url: '/profile/introduce/school',
        },
      ],
    },
    {
      label: t('social_network'),
      children: [
        {
          label: t('add_website'),
          url: '/profile/introduce/website',
        },
        {
          label: t('add_github'),
          url: '/profile/introduce/github',
        },
        {
          label: t('add_linkedin'),
          url: '/profile/introduce/linkedin',
        },
        {
          label: t('add_facebook'),
          url: '/profile/introduce/social',
        },
        {
          label: t('add_instagram'),
          url: '/profile/introduce/instagram',
        },
        {
          label: t('add_tiktok'),
          url: '/profile/introduce/tiktok',
        },
        {
          label: t('add_x'),
          url: '/profile/introduce/x',
        },
      ],
    },
    {
      label: t('personal'),
      children: [
        {
          label: t('add_dob'),
          url: '/profile/introduce/dob',
        },
        {
          label: t('add_gender'),
          url: '/profile/introduce/gender',
        },
        {
          label: t('add_relationship_status'),
          url: '/profile/introduce/relationshipStatus',
        },
        {
          label: t('add_phone'),
          url: '/profile/introduce/phoneNumber',
        },
      ],
    },
    {
      label: t('interests'),
      children: [
        {
          label: t('add_interests'),
          url: '/profile/introduce/interests',
        },
      ],
    },
  ];

  return (
    <div className="pb-6">
      {INTRODUCE_FIELDS.map(field => (
        <div key={field.label}>
          <h3 className="font-medium">{field.label}</h3>
          <div className="flex flex-col gap-2 py-1">
            {field.children.map(child => (
              <Link
                href={child.url}
                key={child.label}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
                title={child.label}
              >
                <AddSquare className="size-5 text-link" />
                <span className="text-sm text-link hover:underline">{child.label}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
      {/* <div className="flex flex-col items-center justify-center w-full">
        <Controller
          name="city"
          control={form.control}
          render={({ field, fieldState }) => (
            <div className="w-full">
              <Input
                {...field}
                id="city"
                label="Tỉnh/Thành phố"
                placeholder="Tỉnh/Thành phố"
                type="text"
                inputSize="md"
                errorText={fieldState.error?.message}
                value={field.value}
                icon={<MapPointWave className="size-5 p-0.5 text-foreground/70" />}
              />
            </div>
          )}
        />
      </div>
      <div className="flex flex-col items-center justify-center w-full">
        <Controller
          name="facebookUrl"
          control={form.control}
          render={({ field, fieldState }) => (
            <div className="w-full">
              <Input
                {...field}
                id="facebookUrl"
                label="Facebook URL"
                placeholder="https://www.facebook.com/username"
                type="text"
                inputSize="md"
                errorText={fieldState.error?.message}
                value={field.value}
                icon={<FaceBookBoldDuotoneIcon className="size-5 p-0.5 text-foreground/70" />}
              />
            </div>
          )}
        />
      </div>
      <div className="flex flex-col items-center justify-center w-full">
        <Controller
          name="instagramUrl"
          control={form.control}
          render={({ field, fieldState }) => (
            <div className="w-full">
              <Input
                {...field}
                id="instagramUrl"
                label="Instagram URL"
                placeholder="https://www.instagram.com/username"
                type="text"
                inputSize="md"
                errorText={fieldState.error?.message}
                value={field.value}
                icon={<InstagramTwoOneIcon className="size-5 p-0.5 text-foreground/70" />}
              />
            </div>
          )}
        />
      </div>
      <div className="flex flex-col items-center justify-center w-full">
        <Controller
          name="tiktokUrl"
          control={form.control}
          render={({ field, fieldState }) => (
            <div className="w-full">
              <Input
                {...field}
                id="tiktokUrl"
                label="Tiktok URL"
                placeholder="https://www.tiktok.com/username"
                type="text"
                inputSize="md"
                errorText={fieldState.error?.message}
                value={field.value}
                icon={<TiktokIcon className="size-5 p-0.5 text-foreground/70" />}
              />
            </div>
          )}
        />
      </div>
      <div className="flex flex-col items-center justify-center w-full">
        <Controller
          name="xUrl"
          control={form.control}
          render={({ field, fieldState }) => (
            <div className="w-full">
              <Input
                {...field}
                id="xUrl"
                label="X URL"
                placeholder="https://x.com/username"
                type="text"
                inputSize="md"
                errorText={fieldState.error?.message}
                value={field.value}
                icon={<XTwitterIcon className="size-5 p-0.5 text-foreground/70" />}
              />
            </div>
          )}
        />
      </div> */}
    </div>
  );
};

export default IntroduceContent;
