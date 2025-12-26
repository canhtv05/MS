'use client';
import { Button } from '@/components/animate-ui/components/buttons/button';
import { IconButton } from '@/components/animate-ui/components/buttons/icon';
import { AddCircle, Pen } from '@solar-icons/react-perf/category/style/Bold';
import { useTranslation } from 'react-i18next';
import { useRef, useState } from 'react';

const ProfilePageChangeAvatar = () => {
  const { t } = useTranslation('profile');
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [showConfirmChangeCoverUrl, setShowConfirmChangeCoverUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];
      if (!allowedTypes.includes(selectedFile.type)) {
        event.target.value = '';
        return;
      }

      const maxSize = 10 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        event.target.value = '';
        return;
      }

      const previewUrl = URL.createObjectURL(selectedFile);
      setCoverImagePreview(previewUrl);
      setPendingFile(selectedFile);
      setShowConfirmChangeCoverUrl(true);
    }
    event.target.value = '';
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <input type="file" onChange={handleFileChange} className="hidden" ref={fileInputRef} />
      <div className="flex items-center gap-2 w-full">
        <Button className="w-full bg-primary/40" variant={'default'} onClick={triggerFileInput}>
          <AddCircle />
          {t('upload_new_avatar')}
        </Button>
      </div>
      <IconButton variant={'outline'}>
        <Pen />
      </IconButton>
    </div>
  );
};

export default ProfilePageChangeAvatar;
