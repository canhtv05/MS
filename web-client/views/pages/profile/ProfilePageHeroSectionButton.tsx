import { IProfilePageProps } from './ProfilePage';
import { Button } from '@/components/animate-ui/components/buttons/button';
import { Settings } from '@solar-icons/react-perf/BoldDuotone';
import Dialog from '@/components/customs/dialog';
import { IconButton } from '@/components/animate-ui/components/buttons/icon';
import Image from 'next/image';
import images from '@/public/imgs';
import { Textarea } from '@headlessui/react';

const EditProfileContainer = () => {
  return (
    <div className="space-y-5">
      {/* avatar */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="md:text-lg font-semibold">Ảnh đại diện</h3>
          <Button variant="ghost" className="text-primary md:text-lg font-semibold">
            Sửa
          </Button>
        </div>
        <div className="flex items-center justify-center w-full">
          <Image
            width={150}
            height={150}
            src={images.avt1.src}
            alt={`Media ${images.avt1.src}`}
            className="object-cover rounded-full"
            unoptimized
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="md:text-lg font-semibold">Ảnh bìa</h3>
          <Button variant="ghost" className="text-primary md:text-lg font-semibold">
            Sửa
          </Button>
        </div>
        <div className="flex items-center justify-center w-full">
          <Image
            height={100}
            width={500}
            src={images.avt1.src}
            alt={`Media ${images.avt1.src}`}
            className="object-cover h-[200px] w-[calc(100%-2rem)] rounded-lg"
            unoptimized
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="md:text-lg font-semibold">Tiểu sử</h3>
      </div>
    </div>
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
      <Dialog
        open={true}
        onClose={() => {}}
        title={t?.('edit_profile') || 'Edit Profile'}
        id="edit-profile"
        size="lg"
        hasBorder
      >
        <EditProfileContainer />
      </Dialog>
    </>
  );
};

export default MeProfilePageHeroSectionButton;
