'use client';

import { Button } from '@/components/animate-ui/components/buttons/button';
import Dialog from '@/components/customs/dialog';
import { Slider } from '@/components/customs/slider';
import images from '@/public/imgs';
import { getCroppedImg } from '@/utils/common';
import { useCallback, useEffect, useState } from 'react';
import Cropper from 'react-easy-crop';
import { useTranslation } from 'react-i18next';
import ProfilePageChooseImage from './ProfilePageChooseImage';
import { useAuthStore } from '@/stores/auth';
import { useProfileMutation } from '@/services/mutations/profile';
import { useQueryClient } from '@tanstack/react-query';

interface IModalEditImage {
  open: boolean;
  onClose: () => void;
  avatarPreview?: string | null;
  pendingFile?: File | null;
}

const ModalEditImage = ({ open, onClose, avatarPreview, pendingFile }: IModalEditImage) => {
  const { t } = useTranslation('profile');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [sliderZoom, setSliderZoom] = useState(1);
  const { user } = useAuthStore();
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const { changeAvatarImageMutation } = useProfileMutation();
  const queryClient = useQueryClient();
  const avatarUrl = user?.profile?.avatarUrl;

  useEffect(() => {
    return () => {
      setCroppedImage(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
      setSliderZoom(1);
    };
  }, [open]);

  const onCropComplete = useCallback(
    async (
      croppedArea: unknown,
      croppedAreaPixels: { x: number; y: number; width: number; height: number },
    ) => {
      try {
        const croppedImage = await getCroppedImg(
          avatarPreview || avatarUrl || images.goku.src,
          croppedAreaPixels,
          rotation,
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
    if (!pendingFile) return;

    try {
      await changeAvatarImageMutation.mutateAsync({ file: pendingFile });
      await refetch();
      queryClient.invalidateQueries({
        queryKey: ['profile', 'media-history-infinite', user?.auth?.username],
      });
    } catch {
    } finally {
      if (coverImagePreview) {
        URL.revokeObjectURL(coverImagePreview);
      }
      setCoverImagePreview(null);
      setPendingFile(null);
      setShowConfirmChangeCoverUrl(false);
    }
  }, [
    pendingFile,
    changeCoverImageMutation,
    refetch,
    queryClient,
    user?.auth?.username,
    coverImagePreview,
  ]);

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        onAccept={() => setShowConfirm(true)}
        title={t?.('profile:choose_image') || ''}
        id="edit-avatar-upload"
        size="lg"
        disableAccept={false}
      >
        <div className="flex flex-col gap-2">
          <div className="relative w-full md:h-[400px] h-[300px]">
            <Cropper
              image={avatarPreview || avatarUrl || images.goku.src}
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
      </Dialog>
      <Dialog
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onAccept={() => {
          onClose();
          setShowConfirm(false);
        }}
        title={t?.('profile:confirm') || ''}
        id="edit-avatar-confirm"
        size="lg"
        disableAccept={false}
        description="profile:confirm_message"
      >
        {croppedImage && (
          <div className="flex justify-center mt-4">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-primary shadow-sm">
              <img src={croppedImage} alt="Cropped" className="w-full h-full object-cover" />
            </div>
          </div>
        )}
      </Dialog>
    </>
  );
};

export default ModalEditImage;
