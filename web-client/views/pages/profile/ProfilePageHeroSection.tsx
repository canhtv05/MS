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
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [sliderZoom, setSliderZoom] = useState(1);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const onCropComplete = React.useCallback(
    async (
      croppedArea: unknown,
      croppedAreaPixels: { x: number; y: number; width: number; height: number },
    ) => {
      try {
        const croppedImage = await getCroppedImg(images.goku.src, croppedAreaPixels);
        setCroppedImage(croppedImage);
      } catch (e) {
        console.error(e);
      }
    },
    [],
  );

  const handleSliderChange = React.useCallback((value: number[]) => {
    const newZoom = value[0];
    setSliderZoom(newZoom);
    setZoom(newZoom);
  }, []);

  const handleCropperZoomChange = React.useCallback((newZoom: number) => {
    setZoom(newZoom);
    setSliderZoom(newZoom);
  }, []);

  const handleRotationChange = React.useCallback((newRotation: number[]) => {
    setRotation(newRotation[0]);
  }, []);

  return (
    <>
      {isLoading && !data?.data ? (
        <div className="w-32 h-32 rounded-full shrink-0 relative border-4 border-white dark:border-gray-800 before:absolute before:inset-0 before:bg-white dark:before:bg-gray-800 before:rounded-full before:z-0">
          <Skeleton className="w-full h-full rounded-full relative z-10" />
        </div>
      ) : (
        <div className="relative">
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
          {user?.auth?.username === data?.data?.userId && !isLoading && (
            <IconButton
              className="absolute! size-8 right-1 cursor-pointer bottom-2 rounded-full dark:bg-gray-800 bg-white hover:dark:bg-gray-800 hover:bg-white hover:opacity-100"
              variant={'outline'}
            >
              <CameraMinimalistic />
            </IconButton>
          )}
        </div>
      )}

      <div className="flex items-center gap-2 ml-auto mb-2">
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
        open={false}
        onClose={() => {}}
        onAccept={() => {}}
        title={t?.('profile:choose_image') || ''}
        id="confirm-cover-upload"
        size="lg"
        disableAccept={true}
        disableFooter={false}
      >
        <div className="flex flex-col gap-2">
          <div className="relative w-full md:h-[400px] h-[300px]">
            <Cropper
              image={images.goku.src}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={1 / 1}
              cropShape="round"
              showGrid={true}
              onCropChange={setCrop}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              onZoomChange={handleCropperZoomChange}
            />
          </div>
          <div className="w-full px-5 flex flex-col items-start justify-start gap-2">
            <span>Zoom</span>
            <div className="flex items-center gap-2 w-full">
              <Button
                onClick={() => {
                  if (zoom === 1) return;
                  setZoom(zoom - 0.1);
                  setSliderZoom(zoom - 0.1);
                }}
                size="icon"
                variant="outline"
                className="rounded-full"
                disabled={zoom === 1}
              >
                <span className="text-xl">-</span>
              </Button>
              <Slider
                value={[sliderZoom]}
                min={1}
                max={3}
                step={0.1}
                onValueChange={handleSliderChange}
              />
              <Button
                onClick={() => {
                  if (zoom === 3) return;
                  setZoom(zoom + 0.1);
                  setSliderZoom(zoom + 0.1);
                }}
                size="icon"
                variant="outline"
                className="rounded-full"
                disabled={zoom === 3}
              >
                <span className="text-xl">+</span>
              </Button>
            </div>
          </div>
          <div className="w-full px-5 flex flex-col items-start justify-start gap-2">
            <span>Rotate</span>
            <div className="flex items-center gap-2 w-full">
              <Button
                onClick={() => {
                  if (rotation === 0) return;
                  setRotation(rotation - 1);
                }}
                size="icon"
                variant="outline"
                className="rounded-full"
                disabled={rotation === 0}
              >
                <span className="text-xl">-</span>
              </Button>
              <Slider
                value={[rotation]}
                min={0}
                max={360}
                step={1}
                onValueChange={handleRotationChange}
              />
              <Button
                onClick={() => {
                  if (rotation === 360) return;
                  setRotation(rotation + 1);
                }}
                size="icon"
                variant="outline"
                className="rounded-full"
                disabled={rotation === 360}
              >
                <span className="text-xl">+</span>
              </Button>
            </div>
          </div>
        </div>
        {/* {croppedImage && (
          <div className="flex justify-center mt-4">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-primary shadow-sm">
              <img src={croppedImage} alt="Cropped" className="w-full h-full object-cover" />
            </div>
          </div>
        )} */}
      </Dialog>
    </>
  );
};

export default ProfilePageHeroSection;
