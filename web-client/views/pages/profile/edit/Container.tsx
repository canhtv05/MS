import { Settings } from '@solar-icons/react-perf/BoldDuotone';
import Dialog from '@/components/customs/dialog';
import { IconButton } from '@/components/animate-ui/components/buttons/icon';
import { useState } from 'react';
import { Button } from '@/components/animate-ui/components/buttons/button';
import { useAuthStore } from '@/stores/auth';
import { useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod/v4';
import { updateProfileSchema } from '@/validations/profile';
import { zodResolver } from '@hookform/resolvers/zod';
import Introduce from '../modals/Introduce';
import { useTranslation } from 'react-i18next';
import { IUserProfileDTO } from '@/types/profile';
import { Gender, RelationshipStatus } from '@/enums/common';
import { Skeleton } from '@/components/customs/skeleton';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';

type UpdateProfileFormValues = z.input<typeof updateProfileSchema>;

const ProfileContainerDynamic = dynamic(() => import('./ProfileContainer'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col gap-3">
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
    <div className="flex flex-col gap-3">
      <ProfileContainerDynamic form={form} user={user} />
      <Introduce form={form} open={open} setOpen={setOpen} />
    </div>
  );
};

const Container = () => {
  const { t } = useTranslation('profile');
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const form = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      bio: '',
      city: '',
      hometown: '',
      jobTitle: '',
      company: '',
      school: '',
      websiteUrl: '',
      githubUrl: '',
      linkedinUrl: '',
      xUrl: '',
      instagramUrl: '',
      tiktokUrl: '',
      facebookUrl: '',
      dob: new Date(),
      gender: Gender.GENDER_OTHER,
      relationshipStatus: RelationshipStatus.RELATIONSHIP_STATUS_SINGLE,
      phoneNumber: '',
      interests: [],
    },
    mode: 'onSubmit',
  });

  const onSubmit = (data: UpdateProfileFormValues) => {
    console.log(data);
  };

  return (
    <>
      <div className="flex items-center justify-center gap-2">
        <Button variant="default" className="gap-2" onClick={() => setOpen(true)}>
          {t?.('edit_profile')}
        </Button>
        <IconButton variant="outline" className="cursor-pointer">
          <div className="flex items-center justify-center w-full h-full">
            <Settings />
          </div>
        </IconButton>
      </div>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={t?.('edit_profile') || 'Edit Profile'}
        id="edit-profile"
        size="lg"
        hasBorder
        form={form}
      >
        <form onSubmit={form.handleSubmit(onSubmit)} id="update-profile-form">
          <EditProfileContainer form={form} user={user?.profile} />
        </form>
      </Dialog>
    </>
  );
};

export default Container;
