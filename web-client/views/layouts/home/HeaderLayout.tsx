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
import { AnimateIcon } from '@/components/animate-ui/icons/icon';
import { LogOut } from '@/components/animate-ui/icons/log-out';
import { Search, SearchIcon } from '@/components/animate-ui/icons/search';
import { Settings } from '@/components/animate-ui/icons/settings';
import { SunIcon } from '@/components/animate-ui/icons/sun';
import { SunMoon } from '@/components/animate-ui/icons/sun-moon';
import { UserRound } from '@/components/animate-ui/icons/user-round';
import { Switch, SwitchThumb } from '@/components/animate-ui/primitives/radix/switch';
import { Input } from '@/components/customs/input';
import Ring from '@/components/customs/ring';
import Logo from '@/components/Logo';
import { cn } from '@/lib/utils';
import images from '@/public/imgs';
import Image, { StaticImageData } from 'next/image';
import useHeaderLayout from './use-header-layout';
import { EllipsisVertical, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import useClickOutside from '@/hooks/use-click-outside';
import { Dispatch, forwardRef, SetStateAction, useRef, useState } from 'react';
import { DropdownMenuHighlightItem } from '@/components/animate-ui/primitives/radix/dropdown-menu';
import { LanguagesIcon } from '@/components/animate-ui/icons/languages';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { useAuthStore } from '@/stores/auth';
import { Button } from '@/components/animate-ui/components/buttons/button';
import Link from 'next/link';
import Dialog from '@/components/customs/dialog';
import { LockIcon } from '@/components/animate-ui/icons/lock';
import ChangePassword from '@/partials/change-password/ChangePassword';
import { itemClassName } from '../auth/AuthLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/customs/avatar';
import { Bell } from '@/components/animate-ui/icons/bell';
import { BookmarkIcon } from '@/components/animate-ui/icons/bookmark';
import UserProfileCard from '@/components/UserProfileCard';
import { useProfileStore } from '@/stores/profile';

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
      {/* <CustomImage
        src={src.src}
        alt={fallback}
        fallbackSrc={images.avt1.src}
        width={35}
        height={35}
        className="rounded-full border-2 border-purple-300 cursor-pointer"
      /> */}
      <Avatar>
        <AvatarImage
          width={35}
          height={35}
          className="rounded-full border-2 border-purple-300 cursor-pointer"
          src={src.src}
          alt={fallback}
        />
        <AvatarFallback>{fallback.charAt(0)}</AvatarFallback>
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
      <div className="p-2 flex group items-center gap-2 justify-start mx-2 mt-2 dark:hover:bg-gray-500/20 hover:bg-gray-300/20 cursor-pointer rounded-lg transition-colors duration-300">
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
//               className="rounded-full w-full dark:bg-gray-700 bg-gray-200"
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
              <span className="text-foreground/70">{t('header.dark_mode')}</span>
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
            <span className="text-foreground/70">{t('header.language')}</span>
          </DropdownMenuSubTrigger>
        </DropdownMenuHighlightItem>
        <DropdownMenuSubContent className="overflow-hidden min-w-40 overflow-y-auto overflow-x-hidden border p-1 z-50">
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
          'z-40 relative max-h-[40vh] bg-gray-50 dark:bg-gray-700 rounded-lg',
          'fixed top-[60px] left-5 right-5 w-auto shadow-lg',
          'lg:absolute lg:w-full max-w-xs lg:top-10 lg:left-0 lg:right-auto',
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

const HeaderLayout = () => {
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
  } = useHeaderLayout();
  useClickOutside(ref, () => setIsShowSearch(false));

  const { t, ready } = useTranslation(['layout', 'auth']);
  const [openLogout, setOpenLogout] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const user = useAuthStore(s => s.user);
  const userProfile = useProfileStore(s => s.userProfile);
  if (!ready) return null;

  return (
    <header className="fixed top-0 left-0 py-2 right-0 z-50 border-b border-foreground/10 bg-background dark:bg-gray-800 backdrop-blur-md">
      <div className="mx-auto w-full px-4 flex h-full items-center justify-center md:px-6">
        <div className="flex items-center justify-between p-1 w-full">
          <div className="pr-5 flex items-center justify-start lg:min-w-[300px]">
            <Logo />
          </div>
          <div className="flex w-full py-0 gap-2 items-center justify-between">
            <div className="flex items-center justify-start relative w-full md:max-w-md max-w-full z-50 flex-1">
              <div className="w-full max-w-xs">
                <Input
                  autoComplete="off"
                  showClear
                  inputSize="md"
                  id="search"
                  className="dark:bg-gray-700 bg-gray-100 h-8 placeholder:font-medium rounded-lg border-transparent"
                  classNameIcon="dark:bg-gray-700 bg-gray-100 h-8"
                  icon={<Search className={'size-5 p-0.5 text-foreground/60 stroke-3'} />}
                  placeholder={t('header.search_placeholder')}
                  onChange={handleSearch}
                  value={search}
                  onFocus={() => setIsShowSearch(true)}
                  endIcon={isLoading ? <Loader2 className="animate-spin size-5 p-0.5" /> : null}
                />
              </div>
              {isShowSearch && debouncedSearch.trim() !== '' && !isLoading && (
                <HomeHeaderSearchLG
                  t={t}
                  ref={ref}
                  value={search}
                  onChange={handleSearch}
                  isShowSearch={isShowSearch}
                  isLoading={isLoading}
                  debouncedValue={debouncedSearch}
                />
              )}
            </div>
            {/* <div>
              <Sheet>
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
            </Sheet>
            </div> */}
            {user?.username ? (
              <div className="flex gap-3 items-center justify-end">
                <div className="flex items-center justify-center gap-3 pr-3">
                  <AnimateIcon animateOnHover>
                    <IconButton
                      className="bg-gray-100 relative hover:opacity-80 transition-opacity duration-300 rounded-lg dark:bg-gray-700 dark:hover:opacity-80 cursor-pointer shadow-none"
                      variant={'accent'}
                    >
                      <Bell className="text-foreground/70 stroke-[2.5]" />
                      <span className="absolute top-2 right-2.5 dark:border-gray-600 border border-gray-100 bg-red-500 text-xs rounded-full w-2 h-2 flex items-center justify-center"></span>
                    </IconButton>
                  </AnimateIcon>
                  <IconButton
                    className="bg-gray-100 dark:bg-gray-700 border-gray-100 group rounded-lg hover:opacity-80 transition-opacity duration-300 dark:hover:opacity-80 cursor-pointer shadow-none"
                    variant={'accent'}
                  >
                    <BookmarkIcon className="text-foreground/70 group-hover:animate-icon" />
                  </IconButton>
                  {/* <AnimateIcon animateOnHover>
                    <IconButton
                    className="bg-gray-100 hover:opacity-95 dark:bg-gray-700 dark:hover:opacity-80 transition-opacity duration-300 rounded-full cursor-pointer shadow-none"
                    variant={'accent'}
                  >
                    <CirclePlus className="text-foreground/70" />
                  </IconButton>
                    <Button
                    variant={'secondary'}
                    className=" hover:opacity-80 transition-opacity duration-300 rounded-lg px-3"
                    >
                      <div className="flex gap-2 items-center justify-center">
                        <SquarePlus className="dark:text-foreground/70 text-white stroke-[2.5px]" />
                        <span className="font-medium dark:text-foreground/70 text-white">
                          {t('header.create')}
                        </span>
                      </div>
                    </Button>
                  </AnimateIcon> */}
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
                    className="w-[220px] [&_span]:text-foreground/70"
                  >
                    <DropdownMenuLabel className="flex gap-2">
                      <UserProfileCard
                        username={user?.username || ''}
                        avatarUrl={userProfile?.avatarUrl || images.avt1.src}
                        fullName={user?.fullName || ''}
                      />
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
                          <span className="text-sm">{t('header.logout')}</span>
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

export default HeaderLayout;
