"use client";

import { Button } from "@/components/animate-ui/components/buttons/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/animate-ui/components/radix/hover-card";
import { GalleryVerticalEnd } from "@/components/animate-ui/icons/gallery-horizontal-end";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { Layers } from "@/components/animate-ui/icons/layers";
import { Star } from "@/components/animate-ui/icons/star";
import { cn, formatStars, getInfoRepo, GitHubRepo } from "@/lib/utils";
import { Github, LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ResourceCardProps {
  content: string;
  url: string;
  icon: LucideIcon;
  title: string;
  hasStar?: boolean;
  imageURL?: string;
}

const ResourceCard = (props: ResourceCardProps) => {
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
            <Image src={imageURL} className="rounded-sm" width={40} height={40} alt="image resource" />
          ) : (
            <Icon />
          )}
        </div>
        <div className="flex flex-col flex-1 justify-start">
          <h4 className={cn("text-foreground", hasStar && "flex items-center gap-1")}>
            {title}
            {hasStar && <Star className={"fill-yellow-400 stroke-yellow-400 size-4"} />}
          </h4>
          <p className="text-foreground/40 line-clamp-3">{content}</p>
        </div>
      </Link>
    </AnimateIcon>
  );
};

const Resources = () => {
  const [repos, setRepos] = useState<{ lib: GitHubRepo | null; me: GitHubRepo | null }>({
    lib: null,
    me: null,
  });

  useEffect(() => {
    async function fetchRepos() {
      try {
        const [libData, meData] = await Promise.all([
          getInfoRepo("imskyleen", "animate-ui"),
          getInfoRepo("canhtv05", "MS"),
        ]);

        setRepos({
          lib: libData ?? null,
          me: meData ?? null,
        });
      } catch (err) {
        console.error(err);
      }
    }

    fetchRepos();
  }, []);

  return (
    <HoverCard openDelay={0} closeDelay={100}>
      <HoverCardTrigger>
        <span className="font-normal cursor-pointer">Tài nguyên</span>
      </HoverCardTrigger>
      <HoverCardContent className="border-0 w-lg" sideOffset={20} transition={{ type: "tween", duration: 0.1 }}>
        <div className="flex justify-between gap-10">
          <div className="flex flex-col flex-1">
            <AnimateIcon animateOnHover>
              <div className="flex justify-start items-center gap-2">
                <GalleryVerticalEnd className={"size-4 text-foreground/40"} />
                <h3 className="text-foreground/40 leading-0">Component repo</h3>
              </div>
            </AnimateIcon>
            <div className="mt-2 flex flex-col">
              <ResourceCard
                hasStar
                title={`Github • ${formatStars(Number(repos.lib?.stargazers_count))}`}
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
                <h3 className="text-foreground/40 leading-0">Github repo</h3>
              </div>
            </AnimateIcon>
            <div className="mt-2 flex flex-col">
              <ResourceCard
                hasStar
                title={`Github • ${formatStars(Number(repos.me?.stargazers_count))}`}
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

const HeaderHomeLayout = () => {
  return (
    <header className="sticky top-8">
      <div className="flex justify-center">
        <div className="p-2 max-w-2xl bg-white w-full rounded-2xl shadow-xl">
          <div className="flex justify-start items-center">
            <div className="flex justify-start items-center gap-3">
              <Image width={35} height={35} src={"/imgs/logo.png"} alt="Leaf Logo" />
              <h1 className="font-bold text-lg text-green-700">LEAF</h1>
            </div>
            <span className="block mx-5 h-6 w-[0.3px] bg-foreground/10"></span>
            <div className="flex flex-1 justify-between items-center w-full">
              <div className="flex justify-center items-center gap-10">
                <Resources />
                <span className="font-normal cursor-pointer">Github</span>
              </div>
              <div className="">
                <Button variant={"outline"} className="shadow-lg">
                  <span className="font-medium">Login</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderHomeLayout;
