'use client';

import { IconButton } from '@/components/animate-ui/components/buttons/icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/animate-ui/components/radix/dropdown-menu';
import { Bell } from '@/components/animate-ui/icons/bell';
import { AnimateIcon } from '@/components/animate-ui/icons/icon';
import { LogOut } from '@/components/animate-ui/icons/log-out';
import { Search, SearchIcon } from '@/components/animate-ui/icons/search';
import { Settings } from '@/components/animate-ui/icons/settings';
import { SunIcon } from '@/components/animate-ui/icons/sun';
import { SunMoon } from '@/components/animate-ui/icons/sun-moon';
import { UserRound } from '@/components/animate-ui/icons/user-round';
import { Switch, SwitchThumb } from '@/components/animate-ui/primitives/radix/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/customs/avatar';
import { Input } from '@/components/customs/input';
import Ring from '@/components/customs/ring';
import Logo from '@/components/Logo';
import { cn } from '@/lib/utils';
import images from '@/public/imgs';
import Image, { StaticImageData } from 'next/image';
import useHomeHeaderLayout from './use-home-header-layout';
import { CirclePlus, EllipsisVertical, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import useClickOutside from '@/hooks/use-click-outside';
import { Dispatch, forwardRef, SetStateAction, useRef, useState } from 'react';
import { DropdownMenuHighlightItem } from '@/components/animate-ui/primitives/radix/dropdown-menu';
import { LanguagesIcon } from '@/components/ui/languages';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { useAuthStore } from '@/stores/auth';
import { Button } from '@/components/animate-ui/components/buttons/button';
import Link from 'next/link';
import Dialog from '@/components/customs/dialog';
import { LockIcon } from '@/components/ui/lock';
import ChangePassword from '@/partials/change-password/ChangePassword';
import { itemClassName } from '../auth/AuthLayout';

interface IHomeHeaderAvatar {
  src: StaticImageData;
  fallback: string;
}

interface IHomeHeaderSearch {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setIsShowSearch?: Dispatch<SetStateAction<boolean>>;
  isShowSearch: boolean;
  isLoading: boolean;
  debouncedValue: string;
  t: TFunction<'translate', undefined>;
}

interface IHomeHeaderSearchCard {
  value: string;
  index: number;
}

interface IHomeHeaderDropdown {
  theme?: string;
  setTheme: Dispatch<SetStateAction<string>>;
  handleChangeLang: (lang: 'vi' | 'en') => void;
  currentLang: 'vi' | 'en';
  itemClassName: string;
}

const HomeHeaderAvatar = ({ fallback, src }: IHomeHeaderAvatar) => {
  return (
    <>
      <Avatar className="border-2 border-purple-300 cursor-pointer">
        <AvatarImage src={src.src} />
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
      <div className="absolute -bottom-0.5 -right-1">
        <Ring className="border-card! border-2" />
      </div>
    </>
  );
};

const HomeHeaderSearchCard = ({ value, index }: IHomeHeaderSearchCard) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className="p-2 flex group items-center gap-2 justify-start mx-2 mt-2 dark:hover:bg-gray-500/20 hover:bg-gray-300/20 cursor-pointer rounded-md transition-colors duration-300">
        <IconButton
          className="rounded-full bg-transparent flex cursor-pointer shadow-none transition-all duration-300"
          variant={'accent'}
        >
          <SearchIcon className={'size-6 p-0.5'} />
        </IconButton>
        <span className="text-foreground text-sm">{value}</span>
      </div>
    </motion.div>
  );
};

// const HomeHeaderSearchMD = ({
//   value,
//   onChange,
//   isLoading,
//   debouncedValue,
//   t,
// }: IHomeHeaderSearch) => {
//   return (
//     <div className={cn(isLoading ? 'overflow-hidden' : 'overflow-y-auto')}>
//       <div className="p-2 flex sticky top-0 z-50 bg-background items-center justify-start gap-3">
//         <SheetClose asChild>
//           <AnimateIcon animateOnHover>
//             <IconButton
//               className="rounded-full flex bg-background cursor-pointer shadow-none"
//               variant={'accent'}
//             >
//               <ArrowLeft className={'size-6 p-0.5'} />
//             </IconButton>
//           </AnimateIcon>
//         </SheetClose>
//         <div className="flex-1">
//           <AnimateIcon animateOnTap>
//             <Input
//               inputSize="md"
//               id="search-md"
//               className="rounded-full w-full dark:bg-gray-600 bg-gray-200"
//               placeholder={t('header.search_placeholder')}
//               value={value}
//               onChange={onChange}
//             />
//           </AnimateIcon>
//         </div>
//       </div>
//       {isLoading ? (
//         <div className="flex mt-2 items-center justify-center">
//           <Loader2 className="animate-spin size-8 text-foreground" />
//         </div>
//       ) : debouncedValue.trim() !== '' && !isLoading ? (
//         <AnimatePresence>
//           {Array.from({ length: 20 }).map((_, index) => (
//             <HomeHeaderSearchCard key={index} value={debouncedValue} index={index} />
//           ))}
//         </AnimatePresence>
//       ) : null}
//     </div>
//   );
// };

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
      <AnimateIcon animateOnHover>
        <DropdownMenuItem onSelect={e => e.preventDefault()}>
          <div
            className="flex items-center justify-between gap-2 w-full"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-center gap-2">
              {theme === 'dark' ? <SunMoon /> : <SunIcon />}
              <span>{t('header.dark_mode')}</span>
            </div>
            <Switch
              className={cn(
                'group relative flex h-6 w-10 cursor-pointer items-center rounded-full border transition-colors',
                'data-[state=checked]:bg-emerald-500 bg-foreground',
              )}
              checked={theme === 'dark'}
              onTap={() => {
                setTheme(theme === 'dark' ? 'light' : 'dark');
              }}
            >
              <SwitchThumb
                className={cn(
                  'h-full aspect-square rounded-full data-[state=checked]:bg-white bg-background transition-transform',
                  'group-data-[state=checked]:translate-x-4',
                )}
                pressedAnimation={{ width: 22 }}
              />
            </Switch>
          </div>
        </DropdownMenuItem>
      </AnimateIcon>
      <DropdownMenuSub>
        <DropdownMenuHighlightItem className="group cursor-pointer">
          <DropdownMenuSubTrigger className={`${itemClassName} cursor-pointer`}>
            <LanguagesIcon className="group-hover:animate-icon text-foreground/70" />
            <span>{t('header.language')}</span>
          </DropdownMenuSubTrigger>
        </DropdownMenuHighlightItem>
        <DropdownMenuSubContent className="overflow-hidden min-w-36 overflow-y-auto overflow-x-hidden border bg-background p-1 z-50">
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
              <span>{t('header.vn')}</span>
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
              <span>{t('header.uk')}</span>
            </DropdownMenuItem>
          </DropdownMenuHighlightItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    </>
  );
};

const HomeHeaderSearchLG = forwardRef(
  (
    { isShowSearch, isLoading, debouncedValue }: IHomeHeaderSearch,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          isLoading ? 'overflow-hidden' : 'overflow-y-auto',
          'z-40 relative max-h-[40vh] bg-background dark:bg-gray-700 border rounded-lg',
          'fixed top-[60px] left-5 right-5 w-auto',
          'lg:absolute lg:w-full lg:top-13 lg:left-1/2 lg:right-auto lg:transform lg:-translate-x-1/2',
        )}
      >
        {isLoading ? (
          <div className="flex mt-2 items-center justify-center">
            <Loader2 className="animate-spin size-8 text-foreground" />
          </div>
        ) : isShowSearch && debouncedValue.trim() !== '' && !isLoading ? (
          <AnimatePresence>
            {Array.from({ length: 20 }).map((_, index) => (
              <HomeHeaderSearchCard key={index} value={debouncedValue} index={index} />
            ))}
          </AnimatePresence>
        ) : null}
      </div>
    );
  },
);
HomeHeaderSearchLG.displayName = 'HomeHeaderSearchLG';

const HomeHeaderLayout = () => {
  const ref = useRef<HTMLDivElement>(null);
  const {
    setTheme,
    theme,
    handleSearch,
    search,
    isShowSearch,
    isLoading,
    debouncedSearch,
    setIsShowSearch,
    handleChangeLang,
    currentLang,
    handleLogout,
  } = useHomeHeaderLayout();
  useClickOutside(ref, () => setIsShowSearch(false));

  const { t, ready } = useTranslation(['layout', 'auth']);
  const [openLogout, setOpenLogout] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const user = useAuthStore(s => s.user);
  if (!ready) return null;

  return (
    <header className="fixed top-0 left-0 h-[54px] right-0 z-50 border-b border-foreground/10 bg-background dark:bg-gray-800 backdrop-blur-md">
      <div className="mx-auto px-4 flex h-full items-center justify-center sm:px-6 lg:px-8">
        <div className="max-w-7xl flex items-center justify-between p-1 w-full">
          <div className="lg:block hidden">
            <Logo />
          </div>
          <div className="flex-1 max-w-md md:py-0 py-[5px] md:mx-8 lg:mx-2 mr-2 items-center lg:justify-center justify-start">
            <div className="block relative z-50">
              <AnimateIcon animateOnTap>
                <Input
                  inputSize="md"
                  id="search"
                  className="dark:bg-gray-600 bg-gray-200 h-9 rounded-lg"
                  classNameIcon="dark:bg-gray-600 bg-gray-200 h-9"
                  icon={<Search className={'size-5 p-0.5 text-foreground/70'} />}
                  placeholder={t('header.search_placeholder')}
                  onChange={handleSearch}
                  value={search}
                  onFocus={() => setIsShowSearch(true)}
                  endIcon={isLoading ? <Loader2 className="animate-spin size-5 p-0.5" /> : null}
                />
              </AnimateIcon>
              {isShowSearch && debouncedSearch.trim() !== '' && !isLoading ? (
                <HomeHeaderSearchLG
                  t={t}
                  ref={ref}
                  value={search}
                  onChange={handleSearch}
                  isShowSearch={isShowSearch}
                  isLoading={isLoading}
                  debouncedValue={debouncedSearch}
                />
              ) : null}
            </div>
            {/* <Sheet>
              <SheetTrigger asChild>
                <IconButton
                  className="md:hidden border rounded-full flex bg-background cursor-pointer shadow-none"
                  variant={'accent'}
                >
                  <Search className={'size-5 p-0.5'} />
                </IconButton>
              </SheetTrigger>
              <SheetContent showCloseButton={false} side="left">
                <SheetHeader className="hidden">
                  <SheetTitle></SheetTitle>
                  <SheetDescription></SheetDescription>
                </SheetHeader>
                <HomeHeaderSearchMD
                  t={t}
                  isLoading={isLoading}
                  isShowSearch={isShowSearch}
                  value={search}
                  onChange={handleSearch}
                  debouncedValue={debouncedSearch}
                  setIsShowSearch={setIsShowSearch}
                />
              </SheetContent>
            </Sheet> */}
          </div>
          {user?.username ? (
            <div className="flex gap-5 items-center justify-center">
              <div className="flex items-center justify-center gap-2">
                <AnimateIcon animateOnHover>
                  <IconButton
                    className="bg-gray-200 hover:opacity-95 dark:bg-gray-600 dark:hover:opacity-80 transition-opacity duration-300 rounded-full cursor-pointer shadow-none"
                    variant={'accent'}
                  >
                    <Bell className="text-foreground/70" />
                  </IconButton>
                </AnimateIcon>
                <AnimateIcon animateOnHover>
                  {/* <IconButton
                    className="bg-gray-100 hover:opacity-95 dark:bg-gray-600 dark:hover:opacity-80 transition-opacity duration-300 rounded-full cursor-pointer shadow-none"
                    variant={'accent'}
                  >
                    <CirclePlus className="text-foreground/70" />
                  </IconButton> */}
                  <Button
                    variant={'secondary'}
                    className="bg-blue-500! hover:opacity-80 transition-opacity duration-300 rounded-lg"
                  >
                    <div className="flex gap-1 items-center justify-center">
                      <CirclePlus className="dark:text-foreground/70 text-white" />
                      <span className="font-normal dark:text-foreground/70 text-white">
                        {t('header.create')}
                      </span>
                    </div>
                  </Button>
                </AnimateIcon>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="relative">
                    <HomeHeaderAvatar src={images.avt1} fallback={user?.username} />
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  side="bottom"
                  align="end"
                  sideOffset={10}
                  className="w-[220px]"
                >
                  <DropdownMenuLabel className="flex gap-2">
                    <div className="relative inline-block">
                      <HomeHeaderAvatar src={images.avt1} fallback={user?.username} />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-[12px] max-w-[150px] w-full text-foreground truncate">
                        {user?.fullname || user?.username}
                      </h3>
                      <span className="text-[12px] max-w-[150px] w-full text-foreground/70 truncate">
                        @{user?.username}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <AnimateIcon animateOnHover>
                      <DropdownMenuItem>
                        <div className="flex items-center justify-center gap-2">
                          <UserRound />
                          <span>{t('header.view_profile')}</span>
                        </div>
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </AnimateIcon>
                    <DropdownMenuItem
                      onClick={() => setOpenChangePassword(true)}
                      className="group cursor-pointer flex items-center justify-start gap-2"
                    >
                      <LockIcon className="group-hover:animate-icon text-foreground/70" />
                      <span>{t('header.change_password')}</span>
                    </DropdownMenuItem>
                    <AnimateIcon animateOnHover>
                      <DropdownMenuItem>
                        <div className="flex items-center justify-center gap-2">
                          <Settings />
                          <span>{t('header.settings')}</span>
                        </div>
                      </DropdownMenuItem>
                    </AnimateIcon>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <HomeHeaderDropdown
                    currentLang={currentLang}
                    handleChangeLang={handleChangeLang}
                    theme={theme}
                    setTheme={setTheme}
                    itemClassName={itemClassName}
                  />
                  <DropdownMenuSeparator />
                  <AnimateIcon animateOnHover>
                    <DropdownMenuItem onClick={() => setOpenLogout(true)}>
                      <div className="flex items-center justify-center gap-2">
                        <LogOut />
                        <span>{t('header.logout')}</span>
                      </div>
                      <DropdownMenuShortcut>⌘L</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </AnimateIcon>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex gap-5 items-center justify-center">
              <div className="flex items-center justify-center gap-5">
                <Link href="/sign-in">
                  <Button variant={'destructive'} className="h-9 px-4">
                    {t('auth:sign_in.sign_in_button')}
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="cursor-pointer bg-transparent!">
                    <IconButton className="flex cursor-pointer shadow-none" variant={'accent'}>
                      <div className="relative transparent!">
                        <EllipsisVertical className="size-6 p-0.5" />
                      </div>
                    </IconButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="bottom"
                    align="end"
                    sideOffset={10}
                    className="w-[220px]"
                  >
                    <HomeHeaderDropdown
                      currentLang={currentLang}
                      handleChangeLang={handleChangeLang}
                      theme={theme}
                      setTheme={setTheme}
                      itemClassName={itemClassName}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}
        </div>
      </div>
      <Dialog
        open={openLogout}
        title={t('auth:logout.title')}
        onClose={() => setOpenLogout(false)}
        description={t('auth:logout.description')}
        onAccept={() => {
          handleLogout();
          setOpenLogout(false);
        }}
      />
      <Dialog
        open={openChangePassword}
        title={t('auth:change_password.title')}
        onClose={() => setOpenChangePassword(false)}
        description={t('auth:change_password.description')}
        id="change-password-form"
      >
        <ChangePassword onSuccess={() => setOpenChangePassword(false)} />
      </Dialog>
    </header>
  );
};

export default HomeHeaderLayout;
