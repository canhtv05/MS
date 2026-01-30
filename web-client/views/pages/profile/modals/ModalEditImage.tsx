'use client';

import { Button } from '@/components/animate-ui/components/buttons/button';
import Dialog from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import images from '@/public/imgs';
import getCroppedImg from '@/utils/common';
import { useCallback, useEffect, useState } from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/auth';
import { useProfileMutation } from '@/services/mutations/profile';
import Image from 'next/image';
import { useProfileModalStore } from '../use-profile-modal';
import { getValidImageSrc } from '@/lib/image-utils';
import { logger } from '@/lib/logger';

interface IModalEditImage {
  open: boolean;
  onClose: (value: boolean) => void;
  avatarPreview?: string | null;
}

const ModalEditImage = ({ open, onClose, avatarPreview }: IModalEditImage) => {
  const { t } = useTranslation('profile');
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const { user } = useAuthStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const { changeAvatarImageMutation } = useProfileMutation();
  const avatarUrl = user?.profile?.avatarUrl;
  const closeParentDialog = useProfileModalStore(state => state.closeParentDialog);
  const setIsPending = useProfileModalStore(state => state.setIsPending);
  const isPending = changeAvatarImageMutation.isPending;

  useEffect(() => {
    setIsPending(isPending);
  }, [isPending, setIsPending]);

  useEffect(() => {
    if (!open) {
      setCroppedImage(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
      setCroppedAreaPixels(null);
      setShowConfirm(false);
    }
  }, [open]);

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    if (!croppedAreaPixels) return;
    try {
      const croppedImageResult = await getCroppedImg(
        getValidImageSrc(avatarPreview || avatarUrl, images.goku.src),
        croppedAreaPixels,
        rotation,
      );
      setCroppedImage(croppedImageResult);
    } catch (e) {
      logger.error(e);
    }
  }, [croppedAreaPixels, rotation, avatarPreview, avatarUrl]);

  const confirmUpload = useCallback(async () => {
    if (!croppedImage) return;

    try {
      // Convert cropped blob URL to File
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      const croppedFile = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });

      await changeAvatarImageMutation.mutateAsync({ file: croppedFile });
    } catch {
    } finally {
      onClose(false);
      setShowConfirm(false);
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
      if (croppedImage) {
        URL.revokeObjectURL(croppedImage);
      }
      setCroppedImage(null);
      closeParentDialog();
    }
  }, [croppedImage, changeAvatarImageMutation, onClose, avatarPreview, closeParentDialog]);

  return (
    <>
      <Dialog
        open={open}
        onClose={() => onClose(false)}
        onAccept={async () => {
          await showCroppedImage();
          setShowConfirm(true);
        }}
        title={t?.('profile:choose_image') || ''}
        id="edit-avatar-upload"
        size="md"
        disableAccept={false}
        isPending={changeAvatarImageMutation.isPending}
      >
        <div className="flex flex-col gap-2">
          <div className="relative w-full h-[300px]">
            {open && (
              <Cropper
                image={getValidImageSrc(avatarPreview || avatarUrl, images.goku.src)}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={3 / 3}
                cropShape="round"
                showGrid={true}
                onCropChange={setCrop}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            )}
          </div>
          <div className="w-full px-5 flex flex-col items-start justify-start gap-2">
            <span>{t?.('zoom')}</span>
            <div className="flex items-center gap-2 w-full">
              <Button
                onClick={() => {
                  if (zoom <= 1) return;
                  setZoom(Math.max(1, zoom - 0.1));
                }}
                size="icon"
                variant="outline"
                className="rounded-full"
                disabled={zoom <= 1}
              >
                <span className="text-xl">-</span>
              </Button>
              <Slider
                value={[zoom]}
                min={1}
                max={3}
                step={0.1}
                onValueChange={values => setZoom(values[0])}
              />
              <Button
                onClick={() => {
                  if (zoom >= 3) return;
                  setZoom(Math.min(3, zoom + 0.1));
                }}
                size="icon"
                variant="outline"
                className="rounded-full"
                disabled={zoom >= 3}
              >
                <span className="text-xl">+</span>
              </Button>
            </div>
          </div>
          <div className="w-full px-5 flex flex-col items-start justify-start gap-2">
            <span>{t?.('rotate')}</span>
            <div className="flex items-center gap-2 w-full">
              <Button
                onClick={() => {
                  if (rotation <= 0) return;
                  setRotation(Math.max(0, rotation - 1));
                }}
                size="icon"
                variant="outline"
                className="rounded-full"
                disabled={rotation <= 0}
              >
                <span className="text-xl">-</span>
              </Button>
              <Slider
                value={[rotation]}
                min={0}
                max={360}
                step={1}
                onValueChange={values => setRotation(values[0])}
              />
              <Button
                onClick={() => {
                  if (rotation >= 360) return;
                  setRotation(Math.min(360, rotation + 1));
                }}
                size="icon"
                variant="outline"
                className="rounded-full"
                disabled={rotation >= 360}
              >
                <span className="text-xl">+</span>
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
      <Dialog
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onAccept={confirmUpload}
        title={t?.('profile:edit_avatar_title') || ''}
        id="edit-avatar-confirm"
        size="sm"
        disableAccept={false}
        description={t?.('profile:edit_avatar_description') || ''}
        isPending={changeAvatarImageMutation.isPending}
      >
        {croppedImage && croppedImage.trim() !== '' && (
          <div className="flex justify-center mt-4">
            <Image
              src={croppedImage}
              width={176}
              height={176}
              unoptimized
              alt="Cropped"
              className="rounded-full object-cover"
            />
          </div>
        )}
      </Dialog>
    </>
  );
};

export default ModalEditImage;
