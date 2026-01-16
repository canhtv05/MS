'use client';

import { updateProfileSchema } from '@/validations/profile';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod/v4';
import {
  MapPointWave,
  UserCircle,
  Share,
  Heart,
  SquareAcademicCap2,
  Suitcase,
} from '@solar-icons/react-perf/Outline';

import { Button } from '@/components/animate-ui/components/buttons/button';
import { Dispatch, SetStateAction } from 'react';
import { Skeleton } from '@/components/customs/skeleton';
import dynamic from 'next/dynamic';
import Dialog from '@/components/customs/dialog';
import { IIntroduceContentProps } from '../edit/Introduce';

type UpdateProfileFormValues = z.input<typeof updateProfileSchema>;

interface IIntroduceProps {
  form: UseFormReturn<UpdateProfileFormValues>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const INTRODUCE_FIELDS = [
  {
    label: 'Tỉnh/Thành phố',
    name: 'city',
    icon: <MapPointWave className="size-5 px-0.5 pb-0.5 text-foreground/70" />,
  },
  {
    label: 'Sự nghiệp',
    name: 'jobTitle',
    icon: <Suitcase className="size-5 px-0.5 pb-0.5 text-foreground/70" />,
  },
  {
    label: 'Trường học',
    name: 'school',
    icon: <SquareAcademicCap2 className="size-5 px-0.5 pb-0.5 text-foreground/70" />,
  },
  {
    label: 'Mạng xã hội',
    name: 'social',
    icon: <Share className="size-5 px-0.5 pb-0.5 text-foreground/70" />,
  },
  {
    label: 'Cá nhân',
    name: 'personal',
    icon: <UserCircle className="size-5 px-0.5 pb-0.5 text-foreground/70" />,
  },
  {
    label: 'Sở thích',
    name: 'interests',
    icon: <Heart className="size-5 px-0.5 pb-0.5 text-foreground/70" />,
  },
];

const IntroduceContent = dynamic<IIntroduceContentProps>(() => import('../edit/Introduce'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  ),
});

const Introduce = ({ form, open, setOpen }: IIntroduceProps) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="md:text-lg font-semibold">Giới thiệu</h3>
        <Button
          onClick={() => setOpen(true)}
          variant="ghost"
          className="text-primary md:text-lg font-semibold hover:bg-primary/10"
        >
          Sửa
        </Button>
        <Dialog
          form={form}
          open={open}
          onClose={() => setOpen(false)}
          title="Sửa thông tin giới thiệu"
          id="edit-introduce-confirm"
          size="sm"
          disableAccept={false}
          hasBorder
        >
          <IntroduceContent form={form} />
        </Dialog>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col items-start gap-2">
          {INTRODUCE_FIELDS.map(field => (
            <div key={field.name}>
              <div className="flex items-center gap-2 justify-start">
                {field.icon}
                <span className="text-sm font-medium leading-none">{field.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Introduce;
