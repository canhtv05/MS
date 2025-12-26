'use client';

import {
  DropdownMenuArrow,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/animate-ui/components/radix/dropdown-menu';
import { DropdownMenuHighlightItem } from '@/components/animate-ui/primitives/radix/dropdown-menu';
import { Switch, SwitchThumb } from '@/components/animate-ui/primitives/radix/switch';
import { cn } from '@/lib/utils';
import images from '@/public/imgs';
import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Sun, Moon, Earth } from '@solar-icons/react-perf/BoldDuotone';

interface IHomeHeaderDropdown {
  theme?: string;
  setTheme: Dispatch<SetStateAction<string>>;
  handleChangeLang: (lang: 'vi' | 'en') => void;
  currentLang: 'vi' | 'en';
  itemClassName: string;
}

const HomeHeaderDropdown = ({
  theme,
  setTheme,
  handleChangeLang,
  currentLang,
  itemClassName,
}: IHomeHeaderDropdown) => {
  const { t, ready } = useTranslation('layout');
  if (!ready) return null;

  return (
    <>
      <DropdownMenuArrow />
      <DropdownMenuItem onSelect={e => e.preventDefault()}>
        <div
          className="flex items-center justify-between gap-2 w-full"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-center gap-2">
            {theme === 'dark' ? <Moon /> : <Sun />}
            <span className="text-foreground/70">{t('header.dark_mode')}</span>
          </div>
          <Switch
            className={cn(
              'group relative flex h-6 w-10 cursor-pointer items-center rounded-full border-none',
              'data-[state=checked]:bg-emerald-500 bg-foreground pl-0.5',
            )}
            checked={theme === 'dark'}
            onTap={() => {
              setTheme(theme === 'dark' ? 'light' : 'dark');
            }}
          >
            <SwitchThumb
              className={cn(
                'h-5 w-5 aspect-square rounded-full data-[state=checked]:bg-white bg-background transition-transform',
                'group-data-[state=checked]:translate-x-4',
              )}
              pressedAnimation={{ width: 20 }}
            />
          </Switch>
        </div>
      </DropdownMenuItem>
      <DropdownMenuSub>
        <DropdownMenuHighlightItem className="group cursor-pointer">
          <DropdownMenuSubTrigger className={`${itemClassName} cursor-pointer`}>
            <Earth className="group-hover:animate-icon text-foreground/70" />
            <span className="text-foreground/70">{t('header.language')}</span>
          </DropdownMenuSubTrigger>
        </DropdownMenuHighlightItem>
        <DropdownMenuSubContent className="overflow-hidden min-w-36 overflow-y-auto overflow-x-hidden border p-1 z-50">
          <DropdownMenuHighlightItem>
            <DropdownMenuItem
              onClick={e => {
                e.preventDefault();
                handleChangeLang('vi');
              }}
              className={`${itemClassName} flex items-center gap-2`}
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
              <span className="text-foreground/70">{t('header.vn')}</span>
            </DropdownMenuItem>
          </DropdownMenuHighlightItem>
          <DropdownMenuHighlightItem>
            <DropdownMenuItem
              onClick={e => {
                e.preventDefault();
                handleChangeLang('en');
              }}
              className={itemClassName}
            >
              <span
                className={`relative inline-flex size-2 rounded-full ${currentLang === 'en' ? 'bg-emerald-400' : 'bg-foreground/20'}`}
              ></span>
              <div className="size-5 relative">
                <Image
                  sizes="(max-width: 768px) 24px, 32px"
                  src={images.uk}
                  alt="VN"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-foreground/70">{t('header.uk')}</span>
            </DropdownMenuItem>
          </DropdownMenuHighlightItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    </>
  );
};

export default HomeHeaderDropdown;
