'use client';

import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction, useEffect } from 'react';
import Dialog from '@/components/customs/dialog';
import { Gallery, GallerySend } from '@solar-icons/react-perf/category/style/BoldDuotone';
import { Button } from '@/components/animate-ui/components/buttons/button';
import { useProfileModalStore } from '../use-profile-modal';

interface IChangeCover {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ChangeCover = ({ open, setOpen }: IChangeCover) => {
  const { t } = useTranslation('profile');

  const triggerFileInput = () => {
    useProfileModalStore.getState().setIsClickModalEdit(true);
    useProfileModalStore.getState().fileInputRef.current?.click();
  };

  useEffect(() => {
    const fileInput = useProfileModalStore.getState().fileInputRef.current;

    const handleFileChange = () => {
      if (fileInput?.files?.length) {
        setOpen(false);
        useProfileModalStore.getState().closeEditContainer();
      }
    };
    fileInput?.addEventListener('change', handleFileChange);
    return () => {
      fileInput?.removeEventListener('change', handleFileChange);
    };
  }, [setOpen]);

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      title={t('change_cover_image')}
      id="change-cover-image"
      size="sm"
      disableFooter={true}
    >
      <div className="flex flex-col gap-3 justify-start">
        <Button
          variant="outline"
          size={'lg'}
          onClick={() => useProfileModalStore.getState().openCoverHistoryDialog()}
          className="border-none outline-none bg-transparent flex items-center justify-start gap-3"
        >
          <Gallery className="size-7" />
          <span className="md:text-sm text-xs">{t('profile:choose_cover_image')}</span>
        </Button>
        <Button
          variant="outline"
          size={'lg'}
          onClick={triggerFileInput}
          className="border-none outline-none bg-transparent flex items-center justify-start gap-3"
        >
          <GallerySend className="size-7" />
          <span className="md:text-sm text-xs">{t('profile:upload_new_cover')}</span>
        </Button>
      </div>
    </Dialog>
  );
};

export default ChangeCover;
