'use client';

import {
  FaceBookBoldDuotoneIcon,
  InstagramTwoOneIcon,
  TiktokIcon,
  XTwitterIcon,
} from '@/components/animate-ui/icons';
import { Input } from '@/components/customs/input';
import { updateProfileSchema } from '@/validations/profile';
import { MapPointWave } from '@solar-icons/react-perf/category/style/BoldDuotone';
import Link from 'next/link';
import { Controller, UseFormReturn } from 'react-hook-form';
import { z } from 'zod/v4';
import { AddSquare } from '@solar-icons/react-perf/Outline';

export type UpdateProfileFormValues = z.input<typeof updateProfileSchema>;

export interface IIntroduceContentProps {
  form: UseFormReturn<UpdateProfileFormValues>;
}

const INTRODUCE_FIELDS = [
  {
    label: 'Tỉnh/Thành phố hiện tại',
    children: [
      {
        label: 'Thêm thành phố',
        url: '/profile/introduce/city',
      },
      {
        label: 'Thêm quê hương',
        url: '/profile/introduce/hometown',
      },
    ],
  },
  {
    label: 'Sự nghiệp',
    children: [
      {
        label: 'Thêm sự nghiệp',
        url: '/profile/introduce/jobTitle',
      },
      {
        label: 'Thêm công ty',
        url: '/profile/introduce/company',
      },
    ],
  },
  {
    label: 'Trường học',
    children: [
      {
        label: 'Thêm trường học',
        url: '/profile/introduce/school',
      },
    ],
  },
  {
    label: 'Mạng xã hội',
    children: [
      {
        label: 'Thêm website',
        url: '/profile/introduce/website',
      },
      {
        label: 'Thêm GitHub',
        url: '/profile/introduce/github',
      },
      {
        label: 'Thêm LinkedIn',
        url: '/profile/introduce/linkedin',
      },
      {
        label: 'Thêm Facebook',
        url: '/profile/introduce/social',
      },
      {
        label: 'Thêm Instagram',
        url: '/profile/introduce/instagram',
      },
      {
        label: 'Thêm Tiktok',
        url: '/profile/introduce/tiktok',
      },
      {
        label: 'Thêm X',
        url: '/profile/introduce/x',
      },
    ],
  },
  {
    label: 'Cá nhân',
    children: [
      {
        label: 'Thêm ngày sinh',
        url: '/profile/introduce/dob',
      },
      {
        label: 'Thêm giới tính',
        url: '/profile/introduce/gender',
      },
      {
        label: 'Thêm tình trạng quan hệ',
        url: '/profile/introduce/relationshipStatus',
      },
      {
        label: 'Thêm số điện thoại',
        url: '/profile/introduce/phoneNumber',
      },
    ],
  },
  {
    label: 'Sở thích',
    children: [
      {
        label: 'Thêm sở thích',
        url: '/profile/introduce/interests',
      },
    ],
  },
];

const IntroduceContent = ({ form }: IIntroduceContentProps) => {
  return (
    <>
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
    </>
  );
};

export default IntroduceContent;
