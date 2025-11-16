'use client';

import { Card, CardContent } from '@/components/customs/card';
import { MobileScreenIcon } from '@/public/icons';
import { LucideIcon, RefreshCcw, Smartphone, TvMinimal } from 'lucide-react';
import Image from 'next/image';

interface HomePlatformCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const homePlatformCards: HomePlatformCardProps[] = [
  {
    icon: TvMinimal,
    title: 'Desktop Experience',
    description:
      'Full-featured interface with multi-column layouts, keyboard shortcuts, and advanced features for power users.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Optimized',
    description:
      'Lightning-fast mobile app with intuitive gestures, offline support, and push notifications to stay connected.',
  },
  {
    icon: RefreshCcw,
    title: 'Real-Time Sync',
    description:
      'Your data syncs instantly across all devices. Start a conversation on mobile, continue on desktop.',
  },
];

const HomeFeatureCard = ({ description, icon: Icon, title }: HomePlatformCardProps) => {
  return (
    <Card className="h-full bg-transparent! border-none shadow-none group py-2">
      <CardContent className="h-full">
        <div className="linear-1 inline-block transition-all p-2 rounded-md group-hover:scale-110 duration-300">
          <Icon className="text-white" />
        </div>
        <h3 className="mt-2 font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed text-sm">{description}</p>
      </CardContent>
    </Card>
  );
};

const HomePlatform = () => {
  return (
    <div className="md:px-20 md:pt-16 px-10 py-12">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="bg-primary/10 flex items-center gap-2 rounded-full px-3 py-2">
          <MobileScreenIcon className="text-primary size-4" />
          <span className="text-primary text-sm font-bold">Cross-Platform</span>
        </div>
        <h2 className="lg:text-5xl md:text-3xl text-xl font-black text-black">
          Beautiful on
          <span className="text-linear ml-2">Every Device</span>
        </h2>
        <p className="text-sm mx-auto max-w-lg text-center text-gray-600">
          Seamlessly switch between desktop, tablet, and mobile. Your conversations follow you
          everywhere.
        </p>
      </div>
      <div className="flex md:flex-row flex-col gap-2 md:px-2 mt-10">
        <div className="relative w-full h-[300px] md:h-auto md:flex-1">
          <Image
            fill
            src="/imgs/platform.png"
            alt="platform"
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
        </div>
        <div className="flex flex-1 flex-col cursor-pointer order-2 md:order-1">
          {homePlatformCards.map((card, index) => (
            <HomeFeatureCard key={index} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePlatform;
