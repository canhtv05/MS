import { IconButton } from '@/components/animate-ui/components/buttons/icon';
import {
  Tooltip,
  TooltipPanel,
  TooltipTrigger,
} from '@/components/animate-ui/components/base/tooltip';
import { Button } from '@/components/animate-ui/components/buttons/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import images from '@/public/imgs';
import { IProfilePageProps } from '../ProfilePageContainer';
import { useAuthStore } from '@/stores/auth';
import { UserPlusRounded, Letter } from '@solar-icons/react-perf/Bold';
import {
  CameraMinimalistic,
  Gallery,
  UserCircle,
} from '@solar-icons/react-perf/category/style/BoldDuotone';
import Dialog from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import ChooseImage from '../modals/ChooseImage';
import { useProfileModalStore } from '../use-profile-modal';
import ChangeAvatar from '../modals/ChangeAvatar';
import { Controlled as ControlledZoom } from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import {
  DropdownMenu,
  DropdownMenuArrow,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/animate-ui/components/radix/dropdown-menu';
import Image from 'next/image';
import { useProfileStore } from '@/stores/profile';
import { getValidImageSrc } from '@/lib/image-utils';
import Container from '../edit/Container';
import Show from '@/components/Show';
import { PrivacyLevel } from '@/enums/common';
import PrivateSection from '../sections/PrivateSection';
import { cn } from '@/lib/utils';

const HeroSectionButton = ({ t }: Pick<IProfilePageProps, 't'>) => {
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

const Hero = ({ isLoading, t, data }: IProfilePageProps) => {
  const user = useAuthStore(state => state.user);
  const { userProfile } = useProfileStore(state => state);
  const { isParentDialogOpen, openParentDialog, closeParentDialog, isPending } =
    useProfileModalStore();
  const [selectedCoverFromHistory, setSelectedCoverFromHistory] = useState<string | null>(null);
  const [avatarFilePreview, setAvatarFilePreview] = useState<string | null>(null);
  const [isClickViewAvatar, setIsClickViewAvatar] = useState(false);

  useEffect(() => {
    if (!isParentDialogOpen) {
      const handleSelectedCoverFromHistory = () => {
        setSelectedCoverFromHistory(null);
        setAvatarFilePreview(null);
      };
      handleSelectedCoverFromHistory();
    }

    return () => {
      setSelectedCoverFromHistory(null);
      setAvatarFilePreview(null);
    };
  }, [isParentDialogOpen]);

  const getImage = (): string => {
    const isOwnProfile = user?.auth?.username === data?.userId;

    const avatarSrc = getValidImageSrc(
      isOwnProfile
        ? avatarFilePreview ||
            selectedCoverFromHistory ||
            userProfile?.avatarUrl ||
            user?.profile?.avatarUrl ||
            data?.avatarUrl
        : data?.avatarUrl,
      images.avt1.src,
    );
    return avatarSrc;
  };

  const canViewAvatar =
    data?.privacy?.profileVisibility === PrivacyLevel.PRIVACY_LEVEL_PUBLIC ||
    user?.auth?.username === data?.userId;

  return (
    <>
      {isLoading && !data ? (
        <div className="flex flex-1 flex-col lg:flex-row items-center lg:items-end lg:gap-4 gap-0 w-full lg:w-auto">
          <div className="w-32 h-32 rounded-full shrink-0 relative shadow-[0_0_0_4px_white] dark:shadow-[0_0_0_4px_rgb(31,41,55)] before:absolute before:inset-0 before:bg-white dark:before:bg-gray-800 before:rounded-full before:z-0 -mt-16">
            <Skeleton className="w-full h-full rounded-full relative z-10" />
          </div>
          <div className="flex flex-col mt-2 mb-2 gap-1 items-center lg:items-start justify-end w-full lg:w-auto">
            <Skeleton className="h-7 w-[130px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col flex-1 lg:flex-row items-center lg:items-end lg:gap-4 gap-0 w-full min-w-0">
          <div className="relative -mt-16 shrink-0 z-10">
            {(() => {
              return (
                <div className="relative w-32 h-32 aspect-square">
                  {getImage() && getImage().trim() !== '' && (
                    <ControlledZoom
                      isZoomed={isClickViewAvatar}
                      onZoomChange={setIsClickViewAvatar}
                      classDialog="!z-[9999]"
                      zoomMargin={20}
                      zoomImg={{
                        src: getImage(),
                        alt: 'Avatar',
                        loading: 'eager',
                      }}
                    >
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="relative w-full h-full">
                          <Image
                            fill
                            src={getImage()}
                            alt="Avatar"
                            className="rounded-full object-cover opacity-0 shadow-[0_0_0_4px_white] dark:shadow-[0_0_0_4px_rgb(31,41,55)]"
                            loading="eager"
                            quality={100}
                            unoptimized
                          />
                        </div>
                      </div>
                    </ControlledZoom>
                  )}

                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          'focus:outline-none p-0 m-0 bg-transparent border-none block rounded-full',
                          canViewAvatar ? 'cursor-pointer' : 'cursor-default',
                        )}
                      >
                        <Avatar className="w-32 h-32">
                          <AvatarImage
                            width={128}
                            height={128}
                            className={cn(
                              'rounded-full',
                              canViewAvatar ? 'cursor-pointer' : 'cursor-default',
                            )}
                            src={getImage()}
                            alt={user?.profile?.fullname || userProfile?.fullname || data?.fullname}
                          />
                          <AvatarFallback className="text-2xl font-bold">
                            {data?.fullname?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align={canViewAvatar ? 'center' : 'start'}
                      side="bottom"
                      sideOffset={-2}
                    >
                      <DropdownMenuArrow />
                      <Show
                        when={canViewAvatar}
                        fallback={
                          <DropdownMenuItem>
                            <PrivateSection
                              data={data}
                              isLoading={isLoading}
                              disableDetail={true}
                            />
                          </DropdownMenuItem>
                        }
                      >
                        <DropdownMenuItem onClick={() => setIsClickViewAvatar(true)}>
                          <UserCircle />
                          <span className="md:text-sm text-xs">{t?.('profile:view_avatar')}</span>
                        </DropdownMenuItem>
                      </Show>
                      {data?.userId === user?.auth?.username && (
                        <DropdownMenuItem onClick={openParentDialog}>
                          <Gallery />
                          <span className="md:text-sm text-xs">{t?.('profile:choose_avatar')}</span>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })()}
            {user?.auth?.username === data?.userId && (
              <IconButton
                className="absolute! size-8 right-1 cursor-pointer bottom-2 rounded-full dark:bg-gray-800 bg-white hover:dark:bg-gray-800 hover:bg-white hover:opacity-100"
                variant={'outline'}
                onClick={() => openParentDialog()}
              >
                <CameraMinimalistic />
              </IconButton>
            )}
          </div>
          <div className="flex flex-col items-center lg:items-start justify-end gap-1 mb-2 flex-1 min-w-0 w-full lg:w-auto text-center lg:text-left">
            <h2 className="md:mt-0 mt-2 text-2xl font-bold text-gray-800 dark:text-white leading-7 whitespace-normal break-normal w-full">
              {data?.fullname}
            </h2>
            <div className="text-sm group text-gray-500 dark:text-gray-400 font-medium flex items-center justify-center lg:justify-start gap-1.5 w-full">
              <p className="break-all block max-w-full">@{data?.userId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 lg:mb-2 mb-0 lg:ml-auto w-full lg:w-auto justify-center lg:justify-end mt-0 lg:mt-4 shrink-0">
            {isLoading && !data ? (
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
                {user?.auth?.username === data?.userId ? (
                  <Container />
                ) : (
                  <HeroSectionButton t={t} />
                )}
              </>
            )}
          </div>
        </div>
      )}

      <Dialog
        open={isParentDialogOpen}
        onClose={closeParentDialog}
        title={t?.('profile:choose_image') || 'Choose Image'}
        id="edit-avatar-upload-parent"
        size="lg"
        disableAccept={!selectedCoverFromHistory}
        onAccept={() => {
          if (!selectedCoverFromHistory) return;
          useProfileModalStore.getState().openChildDialog();
        }}
        titleNode={
          <ChangeAvatar
            selectHistoryAvatarUrl={selectedCoverFromHistory}
            avatarFilePreview={avatarFilePreview}
            onFilePreviewChange={setAvatarFilePreview}
            onHistorySelect={setSelectedCoverFromHistory}
          />
        }
        isPending={isPending}
      >
        <ChooseImage
          onSelect={url => {
            setSelectedCoverFromHistory(url);
            if (url) setAvatarFilePreview(null);
          }}
          selectedUrl={selectedCoverFromHistory}
          isAvatar
        />
      </Dialog>
    </>
  );
};

export default Hero;
