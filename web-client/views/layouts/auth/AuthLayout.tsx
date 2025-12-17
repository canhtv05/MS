'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/animate-ui/components/radix/dropdown-menu';
import { DropdownMenuHighlightItem } from '@/components/animate-ui/primitives/radix/dropdown-menu';
import { LanguagesIcon } from '@/components/animate-ui/icons/languages';
import { useTranslation } from 'react-i18next';
import useAuthLayout from './use-auth-layout';
import Image from 'next/image';
import images from '@/public/imgs';

export const itemClassName =
  'relative z-[1] focus:text-accent-foreground select-none flex items-center gap-2 px-2 py-1.5 text-sm outline-none [&_svg]:size-4 [&_span]:data-[slot=dropdown-menu-shortcut]:text-xs [&_span]:data-[slot=dropdown-menu-shortcut]:ml-auto';

const AuthLayout = () => {
  const { t } = useTranslation('layout');
  const { handleChangeLang, currentLang } = useAuthLayout();

  return (
    <div className="fixed top-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div
            className={`${itemClassName} group-hover:animate-icon cursor-pointer bg-background p-2! border border-foreground/20 rounded-lg`}
          >
            <LanguagesIcon className="text-foreground/70" />
            <span>{t('header.language')}</span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="overflow-hidden min-w-32 overflow-y-auto overflow-x-hidden border bg-background p-1 z-50">
          <DropdownMenuHighlightItem>
            <DropdownMenuItem
              onClick={e => {
                e.preventDefault();
                handleChangeLang('vi');
              }}
              className={`${itemClassName} flex items-center gap-2 cursor-pointer`}
            >
              <span
                className={`relative inline-flex size-2 rounded-full ${currentLang === 'vi' ? 'bg-emerald-400' : 'bg-foreground/20'}`}
              ></span>
              <div className="size-5 relative">
                <Image
                  sizes="(max-width: 768px) 24px, 32px"
                  src={images.vn}
                  alt="VN"
                  fill
                  className="object-contain"
                />
              </div>
              <span>{t('header.vn')}</span>
            </DropdownMenuItem>
          </DropdownMenuHighlightItem>
          <DropdownMenuHighlightItem>
            <DropdownMenuItem
              onClick={e => {
                e.preventDefault();
                handleChangeLang('en');
              }}
              className={`${itemClassName} cursor-pointer`}
            >
              <span
                className={`relative inline-flex size-2 rounded-full ${currentLang === 'en' ? 'bg-emerald-400' : 'bg-foreground/20'}`}
              ></span>
              <div className="size-5 relative">
                <Image
                  sizes="(max-width: 768px) 24px, 32px"
                  src={images.uk}
                  alt="US"
                  fill
                  className="object-contain"
                />
              </div>
              <span>{t('header.uk')}</span>
            </DropdownMenuItem>
          </DropdownMenuHighlightItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AuthLayout;
