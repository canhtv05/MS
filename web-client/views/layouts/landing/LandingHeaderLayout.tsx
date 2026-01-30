'use client';

import { Button } from '@/components/animate-ui/components/buttons/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/animate-ui/components/radix/hover-card';
import { Layers } from '@solar-icons/react-perf/Outline';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ElementType, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from '@/components/animate-ui/components/radix/sheet';
import { ReposProvider, useHeaderHomeRepo } from './LandingHeaderRepoProvider';
import CustomImage from '@/components/ui/custom-image';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { AltArrowDown, MenuDotsSquare } from '@solar-icons/react-perf/Bold';
import { CloseCircle } from '@solar-icons/react-perf/Linear';
import { GithubIcon } from '@/components/animate-ui/icons';

interface IResourceCardProps {
  content: string;
  url: string;
  icon: ElementType;
  title: string;
  imageURL?: string;
}

const ResourceCard = (props: IResourceCardProps) => {
  const { content, icon: Icon, url, title, imageURL } = props;

  return (
    <Link
      target="_blank"
      href={url}
      className="flex gap-2 justify-between md:items-start items-center hover:bg-muted-foreground/10 p-2 rounded-sm cursor-pointer"
    >
      <div
        className={cn(
          'p-2 leading-none rounded-sm border border-card/30 h-full',
          imageURL && 'p-0! border-none',
        )}
      >
        {imageURL ? (
          <CustomImage
            src={imageURL}
            className="rounded-sm"
            width={40}
            height={40}
            alt="image resource"
          />
        ) : (
          <Icon className="text-black" />
        )}
      </div>
      <div className="flex flex-col flex-1 justify-start">
        <h4 className="text-black">
          <span className="line-clamp-1">{title}</span>
        </h4>
        <p className="text-black/40 lg:line-clamp-3 line-clamp-1">{content}</p>
      </div>
    </Link>
  );
};

const Resources = () => {
  const [open, setOpen] = useState(false);
  const { repos } = useHeaderHomeRepo();

  return (
    <HoverCard openDelay={50} closeDelay={100} open={open} onOpenChange={setOpen}>
      <HoverCardTrigger className="cursor-pointer font-normal flex justify-center items-center gap-2">
        <span className="text-black">Resource</span>
        <AltArrowDown className={cn('size-3 text-black h-full block', open && 'rotate-180')} />
      </HoverCardTrigger>
      <HoverCardContent
        className="border-0 w-lg bg-white"
        sideOffset={20}
        transition={{ type: 'tween', duration: 0.25 }}
      >
        <div className="flex justify-between gap-10">
          <div className="flex flex-col flex-1">
            <div className="flex justify-start items-center gap-2">
              <Layers className={'size-4 text-black/40'} />
              <h3 className="text-black/40 leading-0">Component repository</h3>
            </div>
            <div className="mt-2">
              <ResourceCard
                title={`${repos.lib?.full_name}`}
                content={repos.lib?.description ?? 'Xem mã nguồn animate.ui'}
                icon={GithubIcon}
                url="https://github.com/imskyleen/animate-ui"
              />
            </div>
          </div>
          <div className="flex flex-col flex-1">
            <div className="flex justify-start items-center gap-2">
              <Layers className={'size-4 text-black/40'} />
              <h3 className="text-black/40 leading-0">My source</h3>
            </div>
            <div className="mt-2 flex flex-col">
              <ResourceCard
                title={`${repos.me?.full_name}`}
                content={repos.me?.description ?? 'Xem mã nguồn của tôi'}
                icon={GithubIcon}
                imageURL={repos.me?.owner.avatar_url}
                url="https://github.com/canhtv05/MS"
              />
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

const HeaderLG = () => {
  const { showSignup } = useHeaderHomeRepo();
  const router = useRouter();

  return (
    <div className="p-2 max-w-2xl bg-white w-full rounded-xl shadow-xl border border-card/10">
      <div className="flex justify-start items-center">
        <Logo />
        <span className="block mx-5 h-6 w-[0.3px] bg-foreground/10"></span>
        <div className="flex flex-1 justify-between items-center">
          <div className="flex justify-center items-center gap-10">
            <Resources />
            <span className="font-normal cursor-pointer text-black">Blog</span>
          </div>
          <div className="flex items-center">
            <motion.div
              animate={{
                x: showSignup ? -10 : 0,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            >
              <Button
                onClick={() => router.push('/sign-in')}
                variant={'outline'}
                className={cn(
                  !showSignup
                    ? 'shadow-lg border border-card/20!'
                    : 'bg-transparent shadow-none border-none',
                  'border border-gray-300!',
                )}
              >
                <span className="font-medium text-black">Sign in</span>
              </Button>
            </motion.div>
            <motion.div className="flex items-center">
              <AnimatePresence mode="popLayout">
                {showSignup && (
                  <motion.div
                    key="signup"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 30, mass: 0.7 }}
                  >
                    <Link href={'/sign-up'}>
                      <Button variant="default" className="shadow-lg">
                        <span className="font-medium">Sign up</span>
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HeaderMD = () => {
  const { showSignup, repos } = useHeaderHomeRepo();
  const router = useRouter();

  return (
    <div className="p-2 bg-white w-full rounded-xl shadow-xl border border-card/10">
      <div className="flex justify-between items-center px-2">
        <Logo />
        <div className={cn('flex gap-10 items-center', showSignup && 'mr-5')}>
          <div className="flex items-center">
            <motion.div
              animate={{
                x: showSignup ? -10 : 0,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            >
              <Button
                onClick={() => router.push('/sign-in')}
                variant={'outline'}
                className={cn(
                  'bg-transparent shadow-none border-none hover:bg-transparent dark:hover:bg-transparent dark:bg-transparent',
                )}
              >
                <span className="font-medium text-black">Sign in</span>
              </Button>
            </motion.div>
            <motion.div className="flex items-center">
              <AnimatePresence mode="popLayout">
                {showSignup && (
                  <motion.div
                    key="signup"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 30, mass: 0.7 }}
                  >
                    <Sheet>
                      <SheetTrigger className="flex items-center justify-center cursor-pointer">
                        <MenuDotsSquare className={'stroke-1 stroke-black'} />
                      </SheetTrigger>
                      <SheetContent
                        showCloseButton={false}
                        side="right"
                        className="h-full bg-white"
                      >
                        <SheetClose className="absolute top-4 right-4 text-black hover:text-gray-700">
                          <CloseCircle />
                        </SheetClose>
                        <SheetDescription className="hidden"></SheetDescription>
                        <div className="p-5">
                          <SheetTitle className="text-black">Resource</SheetTitle>
                          <div className="flex flex-1 justify-between items-center my-2">
                            <div className="flex justify-center items-center flex-col">
                              <div className="flex flex-col flex-1 gap-2">
                                <div className="flex flex-col">
                                  <div className="flex justify-start items-center gap-2">
                                    <Layers className={'size-4 text-black/40'} />
                                    <h3 className="text-black/40 leading-0">
                                      Component repository
                                    </h3>
                                  </div>
                                </div>
                                <div className="mt-2">
                                  <ResourceCard
                                    title={`${repos.lib?.full_name}`}
                                    content={repos.lib?.description ?? 'Xem mã nguồn animate.ui'}
                                    icon={GithubIcon}
                                    url="https://github.com/imskyleen/animate-ui"
                                  />
                                </div>
                              </div>
                              <div className="flex flex-col">
                                <div className="flex justify-start items-center gap-2">
                                  <Layers className={'size-4 text-black/40'} />
                                  <h3 className="text-black/40 leading-0">My source</h3>
                                </div>
                                <div className="mt-2 flex flex-col">
                                  <ResourceCard
                                    title={`${repos.me?.full_name}`}
                                    content={repos.me?.description ?? 'Xem mã nguồn của tôi'}
                                    icon={GithubIcon}
                                    imageURL={repos.me?.owner.avatar_url}
                                    url="https://github.com/canhtv05/MS"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <SheetTitle className="text-black">Blog</SheetTitle>
                        <SheetFooter>
                          <Button>Create account</Button>
                        </SheetFooter>
                      </SheetContent>
                    </Sheet>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LandingHeaderLayout = () => {
  return (
    <header className="fixed w-full transform -translate-x-1/2! top-4! left-1/2! z-50!">
      <ReposProvider>
        <div className="hidden justify-center lg:flex">
          <HeaderLG />
        </div>
        <div className="flex justify-center lg:hidden px-5">
          <HeaderMD />
        </div>
      </ReposProvider>
    </header>
  );
};

export default LandingHeaderLayout;
