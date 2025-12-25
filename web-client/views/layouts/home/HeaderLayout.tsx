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
  DropdownMenuTrigger,
} from '@/components/animate-ui/components/radix/dropdown-menu';
import { MinimalisticMagnifer } from '@solar-icons/react-perf/Outline';
import { MenuDots } from '@solar-icons/react-perf/Bold';
import { Input } from '@/components/customs/input';
import Logo from '@/components/Logo';
import images from '@/public/imgs';
import useHeaderLayout from './use-header-layout';
import { Loader2Icon } from '@/components/animate-ui/icons';
import useClickOutside from '@/hooks/use-click-outside';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/auth';
import { Button } from '@/components/animate-ui/components/buttons/button';
import Link from 'next/link';
import Dialog from '@/components/customs/dialog';
import ChangePassword from '@/partials/change-password/ChangePassword';
import { itemClassName } from '../auth/AuthLayout';
import UserProfileCard from '@/components/UserProfileCard';
import { useRouter } from 'next/navigation';
import HomeHeaderAvatar from './HomeHeaderAvatar';
import HomeHeaderDropdown from './HomeHeaderDropdown';
import HomeHeaderSearchLG from './HomeHeaderSearchLG';
import { Logout3, Settings, LockPassword } from '@solar-icons/react-perf/BoldDuotone';
import { Bell } from '@solar-icons/react-perf/Outline';
import { UserCircle } from '@solar-icons/react-perf/BoldDuotone';

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
    openLogout,
    setOpenLogout,
  } = useHeaderLayout();
  useClickOutside(ref, () => setIsShowSearch(false));

  const { t, ready } = useTranslation(['layout', 'auth']);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const router = useRouter();
  const user = useAuthStore(s => s.user);

  if (!ready) return null;

  return (
    <header className="fixed top-0 z-50 left-0 py-2 right-0 border-b border-foreground/10 bg-background dark:bg-gray-800 backdrop-blur-md">
      <div className="mx-auto w-full flex h-full items-center justify-center md:px-6 pl-6">
        <div className="flex items-center justify-between p-1 w-full">
          <div className="pr-5 flex items-center justify-start lg:min-w-[280px]">
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
                  icon={
                    <MinimalisticMagnifer className={'size-5 p-0.5 text-foreground/60 stroke-3'} />
                  }
                  placeholder={t('header.search_placeholder')}
                  onChange={handleSearch}
                  value={search}
                  onFocus={() => setIsShowSearch(true)}
                  endIcon={
                    isLoading ? (
                      <Loader2Icon className="animate-spin size-5 p-0.5" />
                    ) : (
                      <div className="items-center gap-1 lg:flex hidden">
                        <kbd className="size-5 leading-none flex items-center justify-center border rounded-[4px] dark:bg-gray-600 bg-white">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-command size-2.5"
                          >
                            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"></path>
                          </svg>
                        </kbd>
                        <kbd className="size-5 flex items-center justify-center border rounded-[4px] dark:bg-gray-600 bg-white">
                          <span className="leading-none text-[0.625rem] pt-px">K</span>
                        </kbd>
                      </div>
                    )
                  }
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
            {user?.auth?.username ? (
              <div className="flex gap-3 items-center justify-end md:pr-0 pr-3">
                <div className="flex items-center justify-center gap-3 pr-3">
                  <IconButton
                    className="bg-gray-100 relative hover:opacity-80 transition-opacity duration-300 rounded-lg dark:bg-gray-700 dark:hover:opacity-80 cursor-pointer shadow-none"
                    variant={'accent'}
                  >
                    <Bell className="text-foreground/70 stroke-[2.5]" />
                    <span className="absolute top-2 right-2.5 dark:border-gray-600 border border-gray-100 bg-red-500 text-xs rounded-full w-2 h-2 flex items-center justify-center"></span>
                  </IconButton>
                  {/* <IconButton
                    className="bg-gray-100 dark:bg-gray-700 border-gray-100 group rounded-lg hover:opacity-80 transition-opacity duration-300 dark:hover:opacity-80 cursor-pointer shadow-none"
                    variant={'accent'}
                  >
                    <BookmarkIcon className="text-foreground/70 group-hover:animate-icon" />
                  </IconButton> */}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <div className="relative">
                      <HomeHeaderAvatar src={images.avt1} fallback={user?.auth?.username} />
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
                        username={user?.auth?.username || ''}
                        avatarUrl={user?.profile?.avatarUrl || images.avt1.src}
                        fullName={user?.profile?.fullname || ''}
                      />
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => router.push(`/@${user?.auth?.username}`)}>
                        <div className="flex items-center justify-center gap-2">
                          <UserCircle />
                          <span>{t('header.view_profile')}</span>
                        </div>
                        <DropdownMenuShortcut>⌘⇧P</DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setOpenChangePassword(true)}
                        className="group cursor-pointer flex items-center justify-start gap-2"
                      >
                        <LockPassword className="text-foreground/70" />
                        <span>{t('header.change_password')}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <div className="flex items-center justify-center gap-2">
                          <Settings />
                          <span>{t('header.settings')}</span>
                        </div>
                      </DropdownMenuItem>
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
                    <DropdownMenuItem variant={'destructive'} onClick={() => setOpenLogout(true)}>
                      <div className="flex items-center justify-center gap-2">
                        <Logout3 className="size-5" />
                        <span className="text-sm">{t('header.logout')}</span>
                      </div>
                      <DropdownMenuShortcut>⌘⇧L</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex gap-5 items-center justify-center">
                <div className="flex items-center justify-center gap-2">
                  <Link href="/sign-in">
                    <Button variant={'destructive'} className="h-8 px-4">
                      {t('auth:sign_in.sign_in_button')}
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild className="cursor-pointer bg-transparent!">
                      <IconButton className="flex cursor-pointer shadow-none" variant={'accent'}>
                        <div className="relative transparent!">
                          <MenuDots
                            className="size-6 p-0.5 rotate-90"
                            style={{ transition: 'none' }}
                          />
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
        onClose={() => setOpenChangePassword(false)}
        open={openChangePassword}
        title={t('auth:change_password.title')}
        description={t('auth:change_password.description')}
        id="change-password-form"
      >
        <ChangePassword onSuccess={() => setOpenChangePassword(false)} />
      </Dialog>
    </header>
  );
};

export default HeaderLayout;
