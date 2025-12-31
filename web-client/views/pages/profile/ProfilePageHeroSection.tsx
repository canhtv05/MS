import { IconButton } from '@/components/animate-ui/components/buttons/icon';
import {
  Tooltip,
  TooltipPanel,
  TooltipTrigger,
} from '@/components/animate-ui/components/base/tooltip';
import { Button } from '@/components/animate-ui/components/buttons/button';
import { Skeleton } from '@/components/customs/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/customs/avatar';
import images from '@/public/imgs';
import { IProfilePageProps } from './ProfilePage';
import { useAuthStore } from '@/stores/auth';
import { Settings } from '@solar-icons/react-perf/Bold';
import { UserPlusRounded, Letter } from '@solar-icons/react-perf/Bold';
import { CameraMinimalistic } from '@solar-icons/react-perf/category/style/BoldDuotone';
import {
  Popover,
  PopoverArrow,
  PopoverPopup,
  PopoverPortal,
  PopoverPositioner,
  PopoverTrigger,
} from '@/components/animate-ui/primitives/base/popover';
import Dialog from '@/components/customs/dialog';
import Cropper from 'react-easy-crop';
import React, { useState } from 'react';
import { Slider } from '@/components/customs/slider';
import { getCroppedImg } from '@/utils/common';
import ModalEditImage from './ModalEditImage';
import ProfilePageChooseImage from './ProfilePageChooseImage';

const ProfilePageHeroSectionButton = ({ t }: Pick<IProfilePageProps, 't'>) => {
  return (
    <>
      <div className="md:flex hidden items-center justify-center gap-2">
        <Button variant="outline" className="gap-2">
          <Letter />
          {t?.('message')}
        </Button>
        <Button variant="default" className="gap-2">
          <UserPlusRounded className="size-5" />
          {t?.('follow')}
        </Button>
      </div>

      <div className="md:hidden flex items-center justify-center gap-2">
        <Button variant="outline" className="gap-2">
          <Letter />
          {t?.('message')}
        </Button>
        {[{ icon: UserPlusRounded, variant: 'default' as const, text: t?.('follow') }].map(
          ({ icon: Icon, variant, text }, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <IconButton className="cursor-pointer shadow-none" variant={variant}>
                  <Icon size={30} />
                </IconButton>
              </TooltipTrigger>
              <TooltipPanel
                side={'top'}
                transition={{ type: 'tween', duration: 0.2, ease: 'easeOut' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <span className="text-white/70">{text}</span>
              </TooltipPanel>
            </Tooltip>
          ),
        )}
      </div>
    </>
  );
};

const MeProfilePageHeroSectionButton = ({ t }: Pick<IProfilePageProps, 't'>) => {
  return (
    <>
      <div className="flex items-center justify-center gap-2">
        <Button variant="default" className="gap-2">
          {t?.('edit_profile')}
        </Button>
        <IconButton variant="outline" className="cursor-pointer">
          <div className="flex items-center justify-center w-full h-full">
            <Settings />
          </div>
        </IconButton>
      </div>
    </>
  );
};

const ProfilePageHeroSection = ({ isLoading, t, data }: IProfilePageProps) => {
  const user = useAuthStore(state => state.user);
  const [openModalEditImage, setOpenModalEditImage] = useState(false);
  const [selectedCoverFromHistory, setSelectedCoverFromHistory] = useState<string | null>(null);

  return (
    <>
      {isLoading && !data?.data ? (
        <div className="flex flex-1 flex-col lg:flex-row items-center lg:items-end lg:gap-4 gap-0 w-full lg:w-auto">
          <div className="w-32 h-32 rounded-full shrink-0 relative border-4 border-white dark:border-gray-800 before:absolute before:inset-0 before:bg-white dark:before:bg-gray-800 before:rounded-full before:z-0 -mt-16">
            <Skeleton className="w-full h-full rounded-full relative z-10" />
          </div>
          <div className="flex flex-col mb-2 gap-1 items-center lg:items-start justify-end w-full lg:w-auto">
            <Skeleton className="h-7 w-[130px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col flex-1 lg:flex-row items-center lg:items-end lg:gap-4 gap-0 w-full min-w-0">
          <div className="relative -mt-16">
            <Popover>
              <PopoverTrigger>
                <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-800">
                  <AvatarImage
                    width={128}
                    height={128}
                    className="rounded-full cursor-pointer"
                    src={images.avt1.src}
                    alt={data?.data?.fullname}
                  />
                  <AvatarFallback className="text-2xl font-bold">
                    {data?.data?.fullname?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverPortal>
                <PopoverPositioner sideOffset={8}>
                  <PopoverPopup className="bg-background p-2 rounded-md shadow-lg border">
                    <PopoverArrow />
                    <div className="p-2">
                      <p>Popover content</p>
                    </div>
                  </PopoverPopup>
                </PopoverPositioner>
              </PopoverPortal>
            </Popover>
            {user?.auth?.username === data?.data?.userId && (
              <IconButton
                className="absolute! size-8 right-1 cursor-pointer bottom-2 rounded-full dark:bg-gray-800 bg-white hover:dark:bg-gray-800 hover:bg-white hover:opacity-100"
                variant={'outline'}
                onClick={() => setOpenModalEditImage(true)}
              >
                <CameraMinimalistic />
              </IconButton>
            )}
          </div>
          <div className="flex flex-col items-center lg:items-start justify-end gap-1 mb-2 flex-1 min-w-0 w-full lg:w-auto text-center lg:text-left">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white leading-7 wrap-break-word break-all w-full">
              {data?.data?.fullname}
            </h2>
            <div className="text-sm group text-gray-500 dark:text-gray-400 font-medium flex items-center justify-center lg:justify-start gap-1.5 w-full">
              <p className="break-all block max-w-full">@{data?.data?.userId}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 lg:mb-2 mb-0 lg:ml-auto w-full lg:w-auto justify-center lg:justify-end mt-0 lg:mt-4 shrink-0">
        {isLoading && !data?.data ? (
          <>
            <div className="md:flex hidden items-center justify-center gap-2">
              <Skeleton className="h-10 w-[110px] rounded-md" />
              <Skeleton className="h-10 w-[100px] rounded-md" />
            </div>
            <div className="md:hidden flex items-center justify-center gap-2">
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
            </div>
          </>
        ) : (
          <>
            {user?.auth?.username === data?.data?.userId ? (
              <MeProfilePageHeroSectionButton t={t} />
            ) : (
              <ProfilePageHeroSectionButton t={t} />
            )}
          </>
        )}
      </div>
      <Dialog
        open={openModalEditImage}
        onClose={() => setOpenModalEditImage(false)}
        title={t?.('profile:choose_image') || 'Choose Image'}
        id="confirm-cover-upload"
        size="lg"
        disableAccept={true}
      >
        <ProfilePageChooseImage
          onSelect={setSelectedCoverFromHistory}
          selectedUrl={selectedCoverFromHistory}
          isAvatar
        />
      </Dialog>
    </>
  );
};

export default ProfilePageHeroSection;
