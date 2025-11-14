"use client";

import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { MessageCircle } from "@/components/animate-ui/icons/message-circle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/customs/avatar";
import { Skeleton } from "@/components/customs/skeleton";
import { Viewport } from "@/enums";
import useViewport from "@/hooks/use-view-port";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "motion/react";
import { UsersRound } from "@/components/animate-ui/icons/users-round";
import Ring from "@/components/customs/ring";

type TItems = {
  username: string;
  imgUrl: string;
  lastOnlineAt: string;
  isOnline?: boolean;
};

const items: TItems[] = [
  {
    username: "Amiran Khan",
    imgUrl: "/imgs/avatars/avatar1.jpeg",
    lastOnlineAt: "Online",
    isOnline: true,
  },
  {
    username: "Leo Park",
    imgUrl: "/imgs/avatars/avatar2.jpg",
    lastOnlineAt: "5m ago",
  },
  {
    username: "Dark",
    imgUrl: "/imgs/avatars/avatar4.jpg",
    lastOnlineAt: "12 hours ago",
  },
  {
    username: "Rain",
    imgUrl: "/imgs/avatars/avatar3.jpg",
    lastOnlineAt: "Online",
    isOnline: true,
  },
];

const HomeFeedCard = ({ imgUrl, lastOnlineAt, username, isOnline }: TItems) => {
  return (
    <div className="rounded-sm w-full">
      <div className="bg-gray-100 rounded-sm p-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Avatar className="relative">
              <AvatarImage src={imgUrl} />
              <AvatarFallback>{username}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              {isOnline && <Ring className="absolute -left-5 z-50 top-8" />}
              <span className="font-bold text-black text-sm">{username}</span>
              <span className="text-black/30 text-sm">{lastOnlineAt}</span>
            </div>
          </div>
        </div>
        <Skeleton className="p-5 bg-gray-200 mt-2 py-12" />
      </div>
    </div>
  );
};

const HomeFeed = () => {
  const { width } = useViewport();

  return (
    <div className="p-5 border border-black/10 bg-white rounded-md lg:mr-2">
      <div className="border border-black/10 bg-white p-3 rounded-md lg:grid md:grid-cols-2 grid-cols-1 gap-3 relative">
        {typeof window !== "undefined" && width < Viewport.LG ? (
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ enabled: true, clickable: true }}
            autoplay={{ pauseOnMouseEnter: true, delay: 2000 }}
            spaceBetween={12}
            className="rounded-sm"
            slidesPerView={1}
            breakpoints={{
              [Viewport.MD]: { slidesPerView: 2 },
              [Viewport.LG]: { slidesPerView: 2 },
            }}
            loop={true}
          >
            {items.map((i, idx) => (
              <SwiperSlide key={idx}>
                <HomeFeedCard {...i} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <>
            {items.map((i, idx) => (
              <HomeFeedCard key={idx} {...i} />
            ))}
          </>
        )}

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
          className="absolute z-40 p-1 px-3 top-0 -right-10 linear-3 rounded-2xl border border-secondary"
        >
          <AnimateIcon animateOnHover>
            <div className="flex items-center gap-2">
              <UsersRound className={"text-secondary size-5"} />
              <div className="flex flex-col text-black/40 text-sm items-start justify-center">
                <span className="text-[12px]">New members</span>
                <span className="text-secondary text-[12px]">+20 today</span>
              </div>
            </div>
          </AnimateIcon>
        </motion.div>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
          className="absolute z-40 p-1 px-3 bottom-0 -left-10 linear-2 rounded-2xl border border-primary"
        >
          <AnimateIcon animateOnHover>
            <div className="flex items-center gap-2">
              <MessageCircle className={"text-primary size-5"} />
              <div className="flex flex-col text-black/40 text-sm items-start justify-center">
                <span className="text-[12px]">Messages</span>
                <span className="text-primary text-[12px]">1K+ sent</span>
              </div>
            </div>
          </AnimateIcon>
        </motion.div>
      </div>
    </div>
  );
};

export default HomeFeed;
