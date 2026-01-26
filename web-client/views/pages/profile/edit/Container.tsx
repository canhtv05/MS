import { Settings } from '@solar-icons/react-perf/BoldDuotone';
import Dialog from '@/components/customs/dialog';
import { IconButton } from '@/components/animate-ui/components/buttons/icon';
import { useState } from 'react';
import { Button } from '@/components/animate-ui/components/buttons/button';
import { useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod/v4';
import { updateProfileSchema } from '@/validations/profile';
import { zodResolver } from '@hookform/resolvers/zod';
import Introduce from '../modals/Introduce';
import { useTranslation } from 'react-i18next';
import { IUpdateBioProfileReq, IUserProfileDTO } from '@/types/profile';
import { Gender, RelationshipStatus } from '@/enums/common';
import { Skeleton } from '@/components/customs/skeleton';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import { useProfileStore } from '@/stores/profile';
import { useProfileMutation } from '@/services/mutations/profile';
import { IResponseObject } from '@/types/common';
import { IProfileDTO } from '@/types/auth';
import { useProfileModalStore } from '../use-profile-modal';
import { useRouter } from 'next/navigation';

type UpdateProfileFormValues = z.input<typeof updateProfileSchema>;

const ProfileContainerDynamic = dynamic(() => import('./ProfileContainer'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col gap-4">
      {new Array(4).fill(0).map((_, idx: number) => (
        <div key={idx} className="flex flex-col gap-2 items-center justify-center">
          <Skeleton className="h-10 w-full" />
          <Skeleton className={cn('h-[150px] w-full', idx === 2 ? 'h-[300px]' : '')} />
        </div>
      ))}
    </div>
  ),
});

const EditProfileContainer = ({
  form,
  user,
}: {
  form: UseFormReturn<UpdateProfileFormValues>;
  user: IUserProfileDTO | undefined;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <ProfileContainerDynamic form={form} user={user} />
      <Introduce form={form} open={open} setOpen={setOpen} />
    </div>
  );
};

const Container = () => {
  const { t } = useTranslation('profile');
  const { userProfile } = useProfileStore();
  const router = useRouter();
  const { updateBioProfileMutation } = useProfileMutation();
  const form = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      bio: userProfile?.bio || '',
      city: userProfile?.introduce?.city || '',
      hometown: userProfile?.introduce?.hometown || '',
      jobTitle: userProfile?.introduce?.jobTitle || '',
      company: userProfile?.introduce?.company || '',
      school: userProfile?.introduce?.school || '',
      websiteUrl: userProfile?.introduce?.websiteUrl || '',
      githubUrl: userProfile?.introduce?.githubUrl || '',
      linkedinUrl: userProfile?.introduce?.linkedinUrl || '',
      xUrl: userProfile?.introduce?.xUrl || '',
      instagramUrl: userProfile?.introduce?.instagramUrl || '',
      tiktokUrl: userProfile?.introduce?.tiktokUrl || '',
      facebookUrl: userProfile?.introduce?.facebookUrl || '',
      dob: new Date(),
      gender: userProfile?.introduce?.gender || Gender.GENDER_OTHER,
      relationshipStatus:
        userProfile?.introduce?.relationshipStatus || RelationshipStatus.RELATIONSHIP_STATUS_SINGLE,
      phoneNumber: userProfile?.introduce?.phoneNumber || '',
      interests: userProfile?.introduce?.interests?.map(interest => interest.id) || [],
    },
    mode: 'onChange',
  });

  const {
    formState: { isDirty },
  } = form;

  const onSubmit = (data: UpdateProfileFormValues) => {
    const payload: IUpdateBioProfileReq = {
      bio: data.bio,
    };
    updateBioProfileMutation.mutate(payload, {
      onSuccess: (data: IResponseObject<IProfileDTO>) => {
        form.reset({ ...form.getValues(), bio: data.data.bio });
      },
    });
  };

  return (
    <>
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="default"
          className="gap-2"
          onClick={() => useProfileModalStore.getState().openEditContainer()}
        >
          {t?.('edit_profile')}
        </Button>
        <IconButton
          onClick={() => router.replace('/settings')}
          variant="outline"
          className="cursor-pointer"
        >
          <div className="flex items-center justify-center w-full h-full">
            <Settings />
          </div>
        </IconButton>
      </div>
      <Dialog
        open={useProfileModalStore.getState().isEditContainerOpen}
        onClose={() => useProfileModalStore.getState().closeEditContainer()}
        title={t?.('edit_profile') || 'Edit Profile'}
        id="edit-profile"
        size="lg"
        hasBorder
        form={form}
        disableAccept={!isDirty || form.formState.isSubmitting}
        onAccept={form.handleSubmit(onSubmit)}
      >
        <EditProfileContainer form={form} user={userProfile} />
      </Dialog>
    </>
  );
};

export default Container;
