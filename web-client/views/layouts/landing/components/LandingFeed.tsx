'use client';

import { AnimateIcon } from '@/components/animate-ui/icons/icon';
import { MessageCircle } from '@/components/animate-ui/icons/message-circle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/customs/avatar';
import { Skeleton } from '@/components/customs/skeleton';
import { Viewport } from '@/enums';
import useViewport from '@/hooks/use-view-port';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { motion } from 'motion/react';
import { UsersRound } from '@/components/animate-ui/icons/users-round';
import Ring from '@/components/customs/ring';
import { useEffect, useState } from 'react';
import images from '@/public/imgs';
import { StaticImageData } from 'next/image';

type TItems = {
  username: string;
  imgUrl: StaticImageData;
  lastOnlineAt: string;
  isOnline?: boolean;
};

const items: TItems[] = [
  {
    username: 'Amiran Khan',
    imgUrl: images.avt1,
    lastOnlineAt: 'Online',
    isOnline: true,
  },
  {
    username: 'Leo Park',
    imgUrl: images.avt2,
    lastOnlineAt: '5m ago',
  },
  {
    username: 'Dark',
    imgUrl: images.avt3,
    lastOnlineAt: '12 hours ago',
  },
  {
    username: 'Rain',
    imgUrl: images.avt4,
    lastOnlineAt: 'Online',
    isOnline: true,
  },
];

const LandingFeedCard = ({ imgUrl, lastOnlineAt, username, isOnline }: TItems) => {
  return (
    <div className="rounded-sm w-full h-full border border-black/10">
      <div className="bg-gray-100 rounded-sm p-2 h-full flex items-baseline flex-col">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Avatar>
                <AvatarImage src={imgUrl.src} />
                <AvatarFallback>{username}</AvatarFallback>
              </Avatar>
              {isOnline && <Ring className="absolute z-50 bottom-2 left-5" />}
            </div>
            <div className="flex flex-col items-start justify-center">
              <span className="font-bold text-black text-sm leading-none">{username}</span>
              <span className="text-black/30 text-[10px] leading">{lastOnlineAt}</span>
            </div>
          </div>
        </div>
        <Skeleton className="p-5 bg-gray-200 mt-2 py-12 w-full flex-1" />
      </div>
    </div>
  );
};

const GRID_SIZE = 2;
const ANIMATION_DURATION = 2000;

const LandingFeed = () => {
  const { width } = useViewport();

  const [positions, setPositions] = useState<TItems[]>([...items]);
  const [swapIndex, setSwapIndex] = useState<number[]>([]);

  useEffect(() => {
    let isMounted = true;

    const swapPairs = async () => {
      while (isMounted) {
        // Swap 0 -> 3
        setSwapIndex([0, 3]);
        await new Promise<void>(resolve => {
          setPositions(prev => {
            const newPositions = [...prev];
            [newPositions[0], newPositions[3]] = [newPositions[3], newPositions[0]];
            return newPositions;
          });
          setTimeout(resolve, ANIMATION_DURATION);
        });

        // Swap 1 -> 2
        setSwapIndex([1, 2]);
        await new Promise<void>(resolve => {
          setPositions(prev => {
            const newPositions = [...prev];
            [newPositions[1], newPositions[2]] = [newPositions[2], newPositions[1]];
            return newPositions;
          });
          setTimeout(resolve, ANIMATION_DURATION);
        });

        // Reset swapIndex sau mỗi vòng
        setSwapIndex([]);
      }
    };

    swapPairs();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="p-5 border border-black/10 bg-white rounded-md lg:mr-2">
      <div className="border border-black/10 bg-white p-3 rounded-md lg:grid  grid-cols-1 gap-3 relative">
        {typeof window !== 'undefined' && width < Viewport.LG ? (
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{
              dynamicBullets: true,
              enabled: true,
              clickable: true,
              renderBullet: (index, className) => {
                return `<span class="${className} bg-purple-500!"></span>`;
              },
            }}
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
                <LandingFeedCard {...i} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="w-full h-full">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                width: '100%',
                height: '100%',
                gap: '12px',
              }}
            >
              {positions.map((item, idx) => (
                <motion.div
                  key={item.imgUrl.src}
                  layout // animate khi vị trí thay đổi
                  transition={{ duration: ANIMATION_DURATION / 1000 }}
                  style={{
                    position: 'relative',
                    zIndex: swapIndex.includes(idx) ? 10 : 1, // nổi lên khi đang swap
                  }}
                >
                  <LandingFeedCard {...item} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
          className="absolute z-40 md:p-2 md:px-4 px-3 py-1.5 md:top-0 md:-right-10 -top-10 -right-10 bg-green-50 rounded-full border border-emerald-400"
        >
          <AnimateIcon animateOnHover>
            <div className="flex items-center gap-2">
              <UsersRound className={'md:block hidden text-emerald-400 size-7 stroke-1'} />
              <div className="flex flex-col text-emerald-400 text-sm items-start justify-center">
                <span className="text-[12px]">New members</span>
                <span className="text-emerald-400 text-[12px]">+20 today</span>
              </div>
            </div>
          </AnimateIcon>
        </motion.div>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
          className="absolute z-40 md:p-2 md:px-4 px-3 py-1.5 md:bottom-0 md:-left-10 -bottom-10 -left-10 bg-blue-50 rounded-full border border-cyan-400"
        >
          <AnimateIcon animateOnHover>
            <div className="flex items-center gap-2">
              <MessageCircle className={'md:block hidden text-cyan-400 size-7 stroke-1'} />
              <div className="flex flex-col text-cyan-400 text-sm items-start justify-center">
                <span className="text-[12px]">Messages</span>
                <span className="text-cyan-400 text-[12px]">1K+ sent</span>
              </div>
            </div>
          </AnimateIcon>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingFeed;
