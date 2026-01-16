'use client';

import { Button } from '@/components/animate-ui/components/buttons/button';
import Dialog from '@/components/customs/dialog';
import { Slider } from '@/components/customs/slider';
import images from '@/public/imgs';
import { getCroppedImg } from '@/utils/common';
import { useCallback, useEffect, useState } from 'react';
import Cropper from 'react-easy-crop';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/auth';
import { useProfileMutation } from '@/services/mutations/profile';
import Image from 'next/image';
import { useProfileModalStore } from '../use-profile-modal';
import { getValidImageSrc } from '@/lib/image-utils';

interface IModalEditImage {
  open: boolean;
  onClose: (value: boolean) => void;
  avatarPreview?: string | null;
}

const ModalEditImage = ({ open, onClose, avatarPreview }: IModalEditImage) => {
  const { t } = useTranslation('profile');
  const CROP_SIZE = 200;
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [sliderZoom, setSliderZoom] = useState(1);
  const { user } = useAuthStore();
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
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
      setSliderZoom(1);
      setShowConfirm(false);
    }
  }, [open]);

  const onCropComplete = useCallback(
    async (
      croppedArea: unknown,
      croppedAreaPixels: { x: number; y: number; width: number; height: number },
    ) => {
      try {
        const imageSrc = getValidImageSrc(avatarPreview || avatarUrl, images.goku.src);
        const croppedImage = await getCroppedImg(
          imageSrc,
          croppedAreaPixels,
          rotation,
          { horizontal: false, vertical: false },
          true, // circular crop
        );
        setCroppedImage(croppedImage);
      } catch (e) {
        console.error(e);
      }
    },
    [avatarPreview, avatarUrl, rotation],
  );

  const handleSliderChange = useCallback((value: number[]) => {
    const newZoom = value[0];
    setSliderZoom(newZoom);
    setZoom(newZoom);
  }, []);

  const handleCropperZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
    setSliderZoom(newZoom);
  }, []);

  const handleRotationChange = useCallback((newRotation: number[]) => {
    setRotation(newRotation[0]);
  }, []);

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
        onAccept={() => setShowConfirm(true)}
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
                aspect={1}
                cropShape="round"
                cropSize={{ width: CROP_SIZE, height: CROP_SIZE }}
                showGrid={true}
                objectFit="contain"
                restrictPosition={false}
                onCropChange={setCrop}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
                onZoomChange={handleCropperZoomChange}
                style={{
                  containerStyle: {
                    width: '100%',
                    height: '100%',
                  },
                }}
              />
            )}
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
