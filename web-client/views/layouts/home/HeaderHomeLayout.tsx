"use client";

import { Button } from "@/components/animate-ui/components/buttons/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/animate-ui/components/radix/hover-card";
import { GalleryVerticalEnd } from "@/components/animate-ui/icons/gallery-horizontal-end";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { Layers } from "@/components/animate-ui/icons/layers";
import { Star } from "@/components/animate-ui/icons/star";
import { cn, formatStars } from "@/lib/utils";
import { ChevronDown, Github, LucideIcon, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "@/components/animate-ui/components/radix/sheet";
import { ReposProvider, useHeaderHomeRepo } from "./HeaderHomeRepoProvider";
import CustomImage from "@/components/customs/CustomImage";
import { useRouter } from "next/navigation";

interface IResourceCardProps {
  content: string;
  url: string;
  icon: LucideIcon;
  title: string;
  hasStar?: boolean;
  imageURL?: string;
}

const ResourceCard = (props: IResourceCardProps) => {
  const { content, icon: Icon, url, title, hasStar, imageURL } = props;

  return (
    <AnimateIcon animateOnHover>
      <Link
        target="_blank"
        href={url}
        className="flex gap-2 justify-between hover:bg-muted transition-colors duration-200 ease-in p-2 rounded-sm cursor-pointer"
      >
        <div
          className={cn(
            "p-2 leading-none rounded-sm border border-card-foreground/30 h-full",
            imageURL && "p-0! border-none"
          )}
        >
          {imageURL ? (
            <CustomImage src={imageURL} className="rounded-sm" width={40} height={40} alt="image resource" />
          ) : (
            <Icon />
          )}
        </div>
        <div className="flex flex-col flex-1 justify-start">
          <h4 className={cn("text-foreground", hasStar && "flex items-center gap-2")}>
            <span className="line-clamp-1">{title}</span>
            {hasStar && <Star className={"fill-yellow-400 stroke-yellow-400 size-4"} />}
          </h4>
          <p className="text-foreground/40 lg:line-clamp-3 line-clamp-1">{content}</p>
        </div>
      </Link>
    </AnimateIcon>
  );
};

const Resources = () => {
  const [open, setOpen] = useState(false);
  const { repos } = useHeaderHomeRepo();

  return (
    <HoverCard openDelay={0} closeDelay={100} open={open} onOpenChange={setOpen}>
      <HoverCardTrigger className="cursor-pointer font-normal flex items-center gap-2">
        Resource
        <ChevronDown className={cn("size-3 text-foreground transition-transform duration-200", open && "rotate-180")} />
      </HoverCardTrigger>
      <HoverCardContent className="border-0 w-lg" sideOffset={20} transition={{ type: "tween", duration: 0.25 }}>
        <div className="flex justify-between gap-10">
          <div className="flex flex-col flex-1">
            <AnimateIcon animateOnHover>
              <div className="flex justify-start items-center gap-2">
                <GalleryVerticalEnd className={"size-4 text-foreground/40"} />
                <h3 className="text-foreground/40 leading-0">Component repository</h3>
              </div>
            </AnimateIcon>
            <div className="mt-2">
              <ResourceCard
                hasStar
                title={`${repos.lib?.full_name} • ${formatStars(Number(repos.lib?.stargazers_count))}`}
                content={repos.lib?.description ?? "Xem mã nguồn animate.ui"}
                icon={Github}
                url="https://github.com/imskyleen/animate-ui"
              />
            </div>
          </div>
          <div className="flex flex-col flex-1">
            <AnimateIcon animateOnHover>
              <div className="flex justify-start items-center gap-2">
                <Layers className={"size-4 text-foreground/40"} />
                <h3 className="text-foreground/40 leading-0">My source</h3>
              </div>
            </AnimateIcon>
            <div className="mt-2 flex flex-col">
              <ResourceCard
                hasStar
                title={`${repos.me?.full_name} • ${formatStars(Number(repos.me?.stargazers_count))}`}
                content={repos.me?.description ?? "Xem mã nguồn của tôi"}
                icon={Github}
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
    <div className="p-2 max-w-2xl bg-background w-full rounded-xl shadow-xl dark:border border-border">
      <div className="flex justify-start items-center">
        <Link href={"/"} className="flex justify-start items-center gap-2">
          <CustomImage width={35} height={35} src={"/imgs/logo.png"} alt="LeafHub Logo" loading="eager" />
          <h1 className="font-bold text-lg text-green-700 tracking-wide">LeafHub</h1>
        </Link>

        <span className="block mx-5 h-6 w-[0.3px] bg-foreground/10"></span>
        <div className="flex flex-1 justify-between items-center">
          <div className="flex justify-center items-center gap-10">
            <Resources />
            <span className="font-normal cursor-pointer">Blog</span>
          </div>
          <div className="flex items-center">
            <motion.div
              layout
              animate={{
                x: showSignup ? -10 : 0,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
            >
              <Button
                onClick={() => router.push("/login")}
                variant={"outline"}
                className={cn(!showSignup ? "shadow-lg" : "bg-transparent shadow-none border-none")}
              >
                <span className="font-medium text-foreground">Login</span>
              </Button>
            </motion.div>
            <motion.div layout className="flex items-center">
              <AnimatePresence mode="popLayout">
                {showSignup && (
                  <motion.div
                    key="signup"
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ type: "spring", stiffness: 350, damping: 30, mass: 0.7 }}
                  >
                    <Button variant="default" className="shadow-lg">
                      <span className="font-medium">Sign up</span>
                    </Button>
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
    <div className="p-2 bg-background w-full rounded-xl shadow-xl dark:border border-border">
      <div className="flex justify-between items-center px-2">
        <Link href={"/"} className="flex justify-start items-center gap-2">
          <CustomImage width={35} height={35} src={"/imgs/logo.png"} alt="LeafHub Logo" loading="eager" />
          <h1 className="font-bold text-lg text-green-700 tracking-wide">LeafHub</h1>
        </Link>
        <div className={cn("flex gap-10 items-center", showSignup && "mr-5")}>
          <div className="flex items-center">
            <motion.div
              layout
              animate={{
                x: showSignup ? -10 : 0,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
            >
              <Button
                onClick={() => router.push("/login")}
                variant={"outline"}
                className={cn(
                  "bg-transparent shadow-none border-none hover:bg-transparent dark:hover:bg-transparent dark:bg-transparent"
                )}
              >
                <span className="font-medium text-foreground">Login</span>
              </Button>
            </motion.div>
            <motion.div layout className="flex items-center">
              <AnimatePresence mode="popLayout">
                {showSignup && (
                  <motion.div
                    key="signup"
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ type: "spring", stiffness: 350, damping: 30, mass: 0.7 }}
                  >
                    <Sheet>
                      <SheetTrigger className="flex items-center justify-center cursor-pointer">
                        <Menu className={"stroke-1"} />
                      </SheetTrigger>
                      <SheetContent side="left" className="h-full">
                        <SheetDescription className="hidden"></SheetDescription>
                        <div className="p-5">
                          <SheetTitle className="text-foreground">Resource</SheetTitle>
                          <div className="flex flex-1 justify-between items-center my-2">
                            <div className="flex justify-center items-center flex-col">
                              <div className="flex flex-col flex-1 gap-2">
                                <div className="flex flex-col">
                                  <AnimateIcon animateOnHover>
                                    <div className="flex justify-start items-center gap-2">
                                      <GalleryVerticalEnd className={"size-4 text-foreground/40"} />
                                      <h3 className="text-foreground/40 leading-0">Component repository</h3>
                                    </div>
                                  </AnimateIcon>
                                  <div className="mt-2">
                                    <ResourceCard
                                      hasStar
                                      title={`${repos.lib?.full_name} • ${formatStars(
                                        Number(repos.lib?.stargazers_count)
                                      )}`}
                                      content={repos.lib?.description ?? "Xem mã nguồn animate.ui"}
                                      icon={Github}
                                      url="https://github.com/imskyleen/animate-ui"
                                    />
                                  </div>
                                </div>
                                <div className="flex flex-col">
                                  <AnimateIcon animateOnHover>
                                    <div className="flex justify-start items-center gap-2">
                                      <Layers className={"size-4 text-foreground/40"} />
                                      <h3 className="text-foreground/40 leading-0">My source</h3>
                                    </div>
                                  </AnimateIcon>
                                  <div className="mt-2 flex flex-col">
                                    <ResourceCard
                                      hasStar
                                      title={`${repos.me?.full_name} • ${formatStars(
                                        Number(repos.me?.stargazers_count)
                                      )}`}
                                      content={repos.me?.description ?? "Xem mã nguồn của tôi"}
                                      icon={Github}
                                      imageURL={repos.me?.owner.avatar_url}
                                      url="https://github.com/canhtv05/MS"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <SheetTitle className="text-foreground">Blog</SheetTitle>
                        </div>
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

const HeaderHomeLayout = () => {
  return (
    <header className="sticky top-4 z-50">
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

export default HeaderHomeLayout;
