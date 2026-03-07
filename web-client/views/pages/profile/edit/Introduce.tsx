'use client';

import { updateProfileSchema } from '@/validations/profile';
import Link from 'next/link';
import { z } from 'zod/v4';
import { AddSquare } from '@solar-icons/react-perf/Outline';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'next/navigation';
import { MouseEvent } from 'react';
import { useModal } from '@/contexts/ModalContext';

export type UpdateProfileFormValues = z.input<typeof updateProfileSchema>;

const IntroduceContent = () => {
  const { t } = useTranslation('profile');
  const { user } = useAuthStore();
  const username = user?.auth?.username;
  const router = useRouter();
  const { closeAllModals } = useModal();

  const handleLinkClick =
    (url: string) =>
    (e: MouseEvent<HTMLAnchorElement>): void => {
      e.preventDefault();
      closeAllModals();
      setTimeout(() => {
        router.push(url);
      }, 150);
    };

  const INTRODUCE_FIELDS = [
    {
      label: t('navigation.basic_info'),
      children: [
        {
          label: t('add_dob'),
          url: `/user/@${username}?tab=introduce&subtab=basic_info`,
        },
        {
          label: t('add_gender'),
          url: `/user/@${username}?tab=introduce&subtab=basic_info`,
        },
        {
          label: t('add_relationship_status'),
          url: `/user/@${username}?tab=introduce&subtab=basic_info`,
        },
        {
          label: t('add_hometown'),
          url: `/user/@${username}?tab=introduce&subtab=basic_info`,
        },
        {
          label: t('add_city'),
          url: `/user/@${username}?tab=introduce&subtab=basic_info`,
        },
      ],
    },
    {
      label: t('navigation.work_and_education'),
      children: [
        {
          label: t('add_school'),
          url: `/user/@${username}?tab=introduce&subtab=work_and_education`,
        },
        {
          label: t('add_career'),
          url: `/user/@${username}?tab=introduce&subtab=work_and_education`,
        },
        {
          label: t('add_company'),
          url: `/user/@${username}?tab=introduce&subtab=work_and_education`,
        },
      ],
    },
    {
      label: t('interests'),
      children: [
        {
          label: t('add_interests'),
          url: `/user/@${username}?tab=introduce&subtab=interests`,
        },
      ],
    },
    {
      label: t('navigation.contacts_and_social'),
      children: [
        {
          label: t('add_phone'),
          url: `/user/@${username}?tab=introduce&subtab=contacts_and_social`,
        },
        {
          label: t('add_website'),
          url: `/user/@${username}?tab=introduce&subtab=contacts_and_social`,
        },
        {
          label: t('add_github'),
          url: `/user/@${username}?tab=introduce&subtab=contacts_and_social`,
        },
        {
          label: t('add_linkedin'),
          url: `/user/@${username}?tab=introduce&subtab=contacts_and_social`,
        },
        {
          label: t('add_facebook'),
          url: `/user/@${username}?tab=introduce&subtab=contacts_and_social`,
        },
        {
          label: t('add_instagram'),
          url: `/user/@${username}?tab=introduce&subtab=contacts_and_social`,
        },
        {
          label: t('add_tiktok'),
          url: `/user/@${username}?tab=introduce&subtab=contacts_and_social`,
        },
        {
          label: t('add_x'),
          url: `/user/@${username}?tab=introduce&subtab=contacts_and_social`,
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
                rel="noopener noreferrer"
                className="flex items-center gap-2"
                title={child.label}
                onClick={handleLinkClick(child.url)}
              >
                <AddSquare className="size-5 text-link" />
                <span className="text-sm text-link hover:underline">{child.label}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default IntroduceContent;
