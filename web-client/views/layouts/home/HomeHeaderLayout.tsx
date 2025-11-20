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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/animate-ui/components/radix/sheet';
import { ArrowLeft } from '@/components/animate-ui/icons/arrow-left';
import { Bell } from '@/components/animate-ui/icons/bell';
import { AnimateIcon } from '@/components/animate-ui/icons/icon';
import { LogOut } from '@/components/animate-ui/icons/log-out';
import { MessageCircleMore } from '@/components/animate-ui/icons/message-circle-more';
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
import { StaticImageData } from 'next/image';
import useHomeHeaderLayout from './use-home-header-layout';
import { Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import useClickOutside from '@/hooks/use-click-outside';
import { Dispatch, forwardRef, SetStateAction, useRef } from 'react';

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
}

interface IHomeHeaderSearchCard {
  value: string;
  index: number;
}

const HomeHeaderAvatar = ({ fallback, src }: IHomeHeaderAvatar) => {
  return (
    <>
      <Avatar className="border-2 border-purple-300 cursor-pointer">
        <AvatarImage src={src.src} />
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
      <div className="absolute -bottom-0.5 -right-1">
        <Ring className="border-card!" />
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
      <AnimateIcon animateOnHover>
        <div className="p-2 flex group items-center gap-2 justify-start mx-2 mt-2 dark:hover:bg-card hover:bg-muted cursor-pointer rounded-md">
          <IconButton
            className="dark:group-hover:bg-muted group-hover:bg-card rounded-full flex cursor-pointer shadow-none"
            variant={'accent'}
          >
            <SearchIcon className={'size-6 p-0.5'} />
          </IconButton>
          <span className="text-foreground text-sm">{value}</span>
        </div>
      </AnimateIcon>
    </motion.div>
  );
};

const HomeHeaderSearchMD = ({ value, onChange, isLoading, debouncedValue }: IHomeHeaderSearch) => {
  return (
    <div className={cn(isLoading ? 'overflow-hidden' : 'overflow-y-auto')}>
      <div className="p-2 flex sticky top-0 z-50 bg-background items-center justify-start gap-3">
        <SheetClose asChild>
          <AnimateIcon animateOnHover>
            <IconButton
              className="rounded-full flex bg-background cursor-pointer shadow-none"
              variant={'accent'}
            >
              <ArrowLeft className={'size-6 p-0.5'} />
            </IconButton>
          </AnimateIcon>
        </SheetClose>
        <div className="flex-1">
          <AnimateIcon animateOnTap>
            <Input
              inputSize="md"
              id="search-md"
              className="rounded-full w-full"
              placeholder="Search posts, hashtags, people, ..."
              value={value}
              onChange={onChange}
            />
          </AnimateIcon>
        </div>
      </div>
      {isLoading ? (
        <div className="flex mt-2 items-center justify-center">
          <Loader2 className="animate-spin size-8 text-foreground" />
        </div>
      ) : debouncedValue.trim() !== '' && !isLoading ? (
        <AnimatePresence>
          {Array.from({ length: 20 }).map((_, index) => (
            <HomeHeaderSearchCard key={index} value={debouncedValue} index={index} />
          ))}
        </AnimatePresence>
      ) : null}
    </div>
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
          'absolute w-[calc(100%-20px)] transform -translate-x-1/2 top-13 z-40 left-1/2 max-h-[40vh] bg-background border rounded-lg',
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
    router,
    setTheme,
    theme,
    handleSearch,
    search,
    isShowSearch,
    isLoading,
    debouncedSearch,
    setIsShowSearch,
  } = useHomeHeaderLayout();
  useClickOutside(ref, () => setIsShowSearch(false));

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-foreground/10 transition-colors duration-300 bg-purple-50 dark:bg-purple-900/20 backdrop-blur-md">
      <div className="mx-auto px-4 flex items-center justify-center sm:px-6 lg:px-8">
        <div className="max-w-7xl flex items-center justify-between p-1 w-full">
          <Logo responsive />
          <div className="flex-1 max-w-xl md:py-0 py-[5px] md:mx-8 mx-2 items-center justify-center">
            <div className="md:block hidden relative z-50">
              <AnimateIcon animateOnTap>
                <Input
                  id="search"
                  className="rounded-full"
                  icon={<Search className={'size-5 p-0.5'} />}
                  placeholder="Search posts, hashtags, people, ..."
                  onChange={handleSearch}
                  value={search}
                  onFocus={() => setIsShowSearch(true)}
                  endIcon={isLoading ? <Loader2 className="animate-spin size-5 p-0.5" /> : null}
                />
              </AnimateIcon>
              {isShowSearch && debouncedSearch.trim() !== '' && !isLoading ? (
                <HomeHeaderSearchLG
                  ref={ref}
                  value={search}
                  onChange={handleSearch}
                  isShowSearch={isShowSearch}
                  isLoading={isLoading}
                  debouncedValue={debouncedSearch}
                />
              ) : null}
            </div>
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
                  isLoading={isLoading}
                  isShowSearch={isShowSearch}
                  value={search}
                  onChange={handleSearch}
                  debouncedValue={debouncedSearch}
                  setIsShowSearch={setIsShowSearch}
                />
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex gap-5 items-center justify-center">
            <div className="flex items-center justify-center gap-2">
              <AnimateIcon animateOnHover>
                <IconButton
                  className="not-hover:bg-transparent! hover:bg-card dark:hover:bg-input rounded-full cursor-pointer shadow-none"
                  variant={'accent'}
                >
                  <Bell />
                </IconButton>
              </AnimateIcon>
              <AnimateIcon animateOnHover>
                <IconButton
                  className="not-hover:bg-transparent! hover:bg-card dark:hover:bg-input rounded-full cursor-pointer shadow-none"
                  variant={'accent'}
                >
                  <MessageCircleMore />
                </IconButton>
              </AnimateIcon>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="relative">
                  <HomeHeaderAvatar src={images.avt1} fallback="John Doe" />
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="bottom"
                align="end"
                sideOffset={10}
                className="w-[220px] transition-colors duration-300"
              >
                <DropdownMenuLabel className="flex gap-2">
                  <div className="relative inline-block">
                    <HomeHeaderAvatar src={images.avt1} fallback="John Doe" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-[12px] max-w-[150px] w-full text-foreground truncate">
                      John doe
                    </h3>
                    <span className="text-[12px] max-w-[150px] w-full text-foreground/70 truncate">
                      @johndoe
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <AnimateIcon animateOnHover>
                    <DropdownMenuItem>
                      <div className="flex items-center justify-center gap-2">
                        <UserRound />
                        <span>View profile</span>
                      </div>
                      <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </AnimateIcon>
                  <AnimateIcon animateOnHover>
                    <DropdownMenuItem>
                      <div className="flex items-center justify-center gap-2">
                        <Settings />
                        <span>Settings</span>
                      </div>
                    </DropdownMenuItem>
                  </AnimateIcon>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <AnimateIcon animateOnHover>
                  <DropdownMenuItem onSelect={e => e.preventDefault()}>
                    <div
                      className="flex items-center justify-between gap-2 w-full"
                      onClick={e => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {theme === 'dark' ? <SunMoon /> : <SunIcon />}
                        <span>Dark mode</span>
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
                <DropdownMenuSeparator />
                <AnimateIcon animateOnHover>
                  <DropdownMenuItem onClick={() => router.push('/sign-in')}>
                    <div className="flex items-center justify-center gap-2">
                      <LogOut />
                      <span>Logout</span>
                    </div>
                    <DropdownMenuShortcut>⌘L</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </AnimateIcon>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HomeHeaderLayout;
