import { IconButton } from '@/components/animate-ui/components/buttons/icon';
import {
  Tooltip,
  TooltipPanel,
  TooltipTrigger,
} from '@/components/animate-ui/components/base/tooltip';
import { Button } from '@/components/animate-ui/components/buttons/button';
import { AddUserIcon, Mail2Icon } from '@/components/animate-ui/icons/common';
import { Skeleton } from '@/components/customs/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/customs/avatar';
import images from '@/public/imgs';
import { IProfilePageProps } from './ProfilePage';

const ProfilePageHeroSection = ({ isLoading, t, data }: IProfilePageProps) => {
  return (
    <>
      {isLoading && !data?.data ? (
        <div className="w-32 h-32 rounded-full shrink-0 relative border-4 border-white dark:border-gray-800 shadow-lg before:absolute before:inset-0 before:bg-white dark:before:bg-gray-800 before:rounded-full before:z-0">
          <Skeleton className="w-full h-full rounded-full relative z-10" />
        </div>
      ) : (
        <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-800 shadow-lg">
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
            <div className="md:flex hidden items-center justify-center gap-2">
              <Button variant="outline" className="gap-2">
                <Mail2Icon />
                {t?.('message')}
              </Button>
              <Button variant="default" className="gap-2">
                <AddUserIcon />
                {t?.('follow')}
              </Button>
            </div>

            <div className="md:hidden flex items-center justify-center gap-2">
              {[
                { icon: Mail2Icon, variant: 'outline' as const, text: t?.('message') },
                { icon: AddUserIcon, variant: 'default' as const, text: t?.('follow') },
              ].map(({ icon: Icon, variant, text }, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <IconButton className="cursor-pointer shadow-none" variant={variant}>
                      <Icon />
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
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ProfilePageHeroSection;
