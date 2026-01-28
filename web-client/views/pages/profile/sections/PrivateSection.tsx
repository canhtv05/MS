'use client';

import { IDetailUserProfileDTO } from '@/types/profile';
import { useTranslation } from 'react-i18next';
import { User } from '@solar-icons/react-perf/BoldDuotone';
import { PrivacyLevel } from '@/enums/common';
import { Skeleton } from '@/components/customs/skeleton';
import { ShieldUser } from '@solar-icons/react-perf/BoldDuotone';
import Show from '@/components/Show';
import { useState } from 'react';
import Dialog from '@/components/customs/dialog';
import { useAuthStore } from '@/stores/auth';
import Image from 'next/image';

interface IPrivateSectionProps {
  data?: IDetailUserProfileDTO;
  isLoading?: boolean;
}

const PrivateSection = ({ data, isLoading }: IPrivateSectionProps) => {
  const { user } = useAuthStore();
  const { t } = useTranslation('profile');
  const privacy = data?.privacy;
  const [showDetail, setShowDetail] = useState(false);

  if (!privacy) return null;

  return (
    <>
      <Show
        when={privacy && !isLoading}
        fallback={
          <div className="flex gap-(--sp-layout)">
            <Skeleton className="h-10 w-full flex-1" />
            <Skeleton className="h-10 w-full flex-4" />
          </div>
        }
      >
        <div className="flex flex-col gap-2">
          <Show
            when={
              privacy.profileVisibility &&
              privacy.profileVisibility === PrivacyLevel.PRIVACY_LEVEL_PRIVATE
            }
          >
            <div className="flex items-center gap-2 text-xs text-foreground/60 group">
              <ShieldUser className="sm:size-14 size-10 text-primary" />
              <div className="flex flex-col items-start">
                <span className="max-w-full wrap-break-word font-black text-sm sm:text-sm">
                  {user?.auth?.username === data?.userId ? 'Bạn' : data?.fullname} đã khóa bảo vệ
                  trang cá nhân
                </span>
                <span className="max-w-full wrap-break-word font-medium text-xs">
                  Chế độ: {t(`common:privacy_level.${privacy.profileVisibility}`)}
                </span>
                <button
                  type="button"
                  onClick={() => setShowDetail(true)}
                  className="text-link text-xs cursor-pointer"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          </Show>
          <Show
            when={
              privacy.profileVisibility &&
              privacy.profileVisibility === PrivacyLevel.PRIVACY_LEVEL_FRIENDS_ONLY
            }
          >
            <div className="flex items-center gap-2 text-xs text-foreground/60 group">
              <User className="w-3.5 h-3.5 text-foreground/40" />
              <span className="truncate max-w-full font-medium">
                {t(`common:privacy_level.${privacy.profileVisibility}`)}
              </span>
              <button className="text-link text-xs cursor-pointer">Xem chi tiết</button>
            </div>
          </Show>
        </div>
      </Show>
      <Dialog
        disableFooter
        open={showDetail}
        onClose={() => setShowDetail(false)}
        title="Chi tiết chế độ bảo vệ"
      >
        <div className="flex flex-col gap-3 text-xs text-foreground/80">
          <div className="w-full h-32 rounded-lg bg-muted/60 flex items-center justify-center text-[10px] text-foreground/50 mb-1">
            Ảnh minh họa khóa bảo vệ trang cá nhân
            {/* <Image /> */}
          </div>

          {privacy.profileVisibility === PrivacyLevel.PRIVACY_LEVEL_PRIVATE && (
            <>
              <p className="font-semibold text-foreground text-sm">
                Trang cá nhân của bạn có khóa bảo vệ
              </p>
              <p>
                Khi khóa bảo vệ trang cá nhân, bạn có thể giữ ảnh và bài viết của mình riêng tư hơn.
              </p>
              <p className="font-medium mt-1">Khóa bảo vệ hoạt động như thế nào</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>
                  Chỉ bạn bè mới nhìn thấy các ảnh, bài viết, tin trước đây và sau này trên trang cá
                  nhân của bạn.
                </li>
                <li>
                  Chỉ bạn bè mới nhìn thấy ảnh đại diện và ảnh bìa của bạn ở độ phân giải đầy đủ.
                </li>
                <li>
                  Mọi người vẫn sẽ xem được thông tin hiển thị ở chế độ Công khai trên trang cá
                  nhân, bài viết công khai có gắn thẻ bạn, cũng như có thể tìm kiếm và gửi cho bạn
                  lời mời kết bạn.
                </li>
              </ul>
            </>
          )}

          {privacy.profileVisibility === PrivacyLevel.PRIVACY_LEVEL_FRIENDS_ONLY && (
            <>
              <p className="font-semibold text-foreground text-sm">
                Trang cá nhân của bạn đang giới hạn chế độ xem
              </p>
              <p>
                Ở chế độ chỉ bạn bè, phần lớn nội dung trên trang cá nhân của bạn chỉ hiển thị với
                những người đã là bạn bè.
              </p>
              <p className="font-medium mt-1">Giới hạn hiển thị hoạt động như thế nào</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>
                  Chỉ bạn bè mới xem được phần lớn ảnh, bài viết và tin trên trang cá nhân của bạn.
                </li>
                <li>
                  Ảnh đại diện và ảnh bìa có thể được hiển thị ở mức độ phù hợp với cài đặt riêng tư
                  hiện tại.
                </li>
                <li>
                  Mọi người vẫn có thể xem một số thông tin công khai, bài viết công khai có gắn thẻ
                  bạn, tìm kiếm và gửi lời mời kết bạn.
                </li>
              </ul>
            </>
          )}
        </div>
      </Dialog>
    </>
  );
};

export default PrivateSection;
