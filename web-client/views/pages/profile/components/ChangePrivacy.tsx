'use client';

import {
  DropdownMenu,
  DropdownMenuArrow,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/animate-ui/components/radix/dropdown-menu';
import { DropdownMenuHighlightItem } from '@/components/animate-ui/primitives/radix/dropdown-menu';
import { MenuDots } from '@solar-icons/react-perf/Bold';
import { useTranslation } from 'react-i18next';
import Dialog from '@/components/ui/dialog';
import { useCallback, useState } from 'react';
import RenderSelect from './RenderSelect';
import { usePrivacyQuery } from '@/services/queries/profile';
import { useProfileMutation } from '@/services/mutations/profile';
import { IUserProfilePrivacyDTO } from '@/types/profile';
import { PrivacyLevel } from '@/enums/common';
import { IconButton } from '@/components/animate-ui/components/buttons/icon';

interface IChangePrivacyProps {
  type: 'friends' | 'gallery';
}

const ChangePrivacy = ({ type = 'friends' }: IChangePrivacyProps) => {
  const { t } = useTranslation(['settings', 'profile']);
  const [openChangeFriendPrivacy, setOpenChangeFriendPrivacy] = useState(false);
  const { data: privacyData } = usePrivacyQuery();
  const { updatePrivacyMutation } = useProfileMutation();
  const [privacyDataState, setPrivacyDataState] = useState<
    Omit<IUserProfilePrivacyDTO, 'id'> | null | undefined
  >(privacyData ?? null);

  const handleSetPrivacy = useCallback(
    async (key: keyof Omit<IUserProfilePrivacyDTO, 'id'>, value: PrivacyLevel) => {
      const base: Omit<IUserProfilePrivacyDTO, 'id'> =
        privacyDataState ??
        (privacyData
          ? {
              profileVisibility: privacyData.profileVisibility,
              friendsVisibility: privacyData.friendsVisibility,
              postsVisibility: privacyData.postsVisibility,
              introduceVisibility: privacyData.introduceVisibility,
              galleryVisibility: privacyData.galleryVisibility,
            }
          : {
              profileVisibility: PrivacyLevel.PRIVACY_LEVEL_PUBLIC,
              friendsVisibility: PrivacyLevel.PRIVACY_LEVEL_PUBLIC,
              postsVisibility: PrivacyLevel.PRIVACY_LEVEL_PUBLIC,
              introduceVisibility: PrivacyLevel.PRIVACY_LEVEL_PUBLIC,
              galleryVisibility: PrivacyLevel.PRIVACY_LEVEL_PUBLIC,
            });
      if (base[key] === value) return;
      const next = { ...base, [key]: value };
      setPrivacyDataState(next);
    },
    [privacyDataState, privacyData],
  );

  const handleSavePrivacy = useCallback(async () => {
    if (!privacyDataState) return;
    updatePrivacyMutation.mutate(
      {
        profileVisibility: privacyDataState.profileVisibility,
        friendsVisibility: privacyDataState.friendsVisibility,
        postsVisibility: privacyDataState.postsVisibility,
        introduceVisibility: privacyDataState.introduceVisibility,
        galleryVisibility: privacyDataState.galleryVisibility,
      },
      {
        onSuccess: () => {
          setPrivacyDataState(privacyDataState);
        },
      },
    );
  }, [privacyDataState, updatePrivacyMutation]);

  const privacyMap = {
    friends: {
      titleKey: t('settings:privacy.friends_visibility.title'),
      descKey: t('settings:privacy.friends_visibility.description'),
      value: privacyDataState?.friendsVisibility ?? PrivacyLevel.PRIVACY_LEVEL_PUBLIC,
      setter: (value: string) => handleSetPrivacy('friendsVisibility', value as PrivacyLevel),
    },
    gallery: {
      titleKey: t('privacy.gallery_visibility.title'),
      descKey: t('privacy.gallery_visibility.description'),
      value: privacyDataState?.galleryVisibility ?? PrivacyLevel.PRIVACY_LEVEL_PUBLIC,
      setter: (value: string) => handleSetPrivacy('galleryVisibility', value as PrivacyLevel),
    },
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <div>
            <IconButton variant="default">
              <MenuDots className="text-white size-[16px]" />
            </IconButton>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="bottom"
          align="end"
          sideOffset={10}
          className="[&_span]:text-foreground/70"
        >
          <DropdownMenuArrow />
          <DropdownMenuHighlightItem>
            <DropdownMenuItem
              onClick={() => setOpenChangeFriendPrivacy(true)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <span>{t('profile:edit_friend_privacy')}</span>
            </DropdownMenuItem>
          </DropdownMenuHighlightItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog
        open={openChangeFriendPrivacy}
        title={t('profile:edit_friend_privacy')}
        onClose={() => setOpenChangeFriendPrivacy(false)}
        description={t(privacyMap[type].descKey)}
        disableAccept={updatePrivacyMutation.isPending}
        onAccept={handleSavePrivacy}
      >
        <RenderSelect
          value={privacyMap[type].value}
          onValueChange={(value: string) => privacyMap[type].setter(value)}
          labelKey={privacyMap[type].titleKey}
          t={t}
          modal={false}
        />
      </Dialog>
    </>
  );
};

export default ChangePrivacy;
