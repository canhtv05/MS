'use client';

import { Card, CardContent } from '@/components/customs/card';
import { cn } from '@/lib/utils';
import images from '@/public/imgs';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Smartphone, Tablet, Refresh } from '@solar-icons/react-perf/Outline';
import { Icon } from '@solar-icons/react-perf/lib/types';

interface LandingPlatformCardProps {
  icon: Icon;
  title: string;
  description: string;
  className: string;
}

const homePlatformCards: LandingPlatformCardProps[] = [
  {
    icon: Tablet,
    title: 'Desktop Experience',
    description:
      'Full-featured interface with multi-column layouts, keyboard shortcuts, and advanced features for power users.',
    className: 'bg-pink-400 border-pink-200 hover:bg-pink-200 hover:shadow-pink-100 shadow-lg',
  },
  {
    icon: Smartphone,
    title: 'Mobile Optimized',
    description:
      'Lightning-fast mobile app with intuitive gestures, offline support, and push notifications to stay connected.',
    className: 'bg-amber-400 border-amber-200 hover:bg-amber-200 hover:shadow-amber-100 shadow-lg',
  },
  {
    icon: Refresh,
    title: 'Real-Time Sync',
    description:
      'Your data syncs instantly across all devices. Start a conversation on mobile, continue on desktop.',
    className:
      'bg-emerald-400 border-emerald-200 hover:bg-emerald-200 hover:shadow-emerald-100 shadow-lg',
  },
];

const LandingFeatureCard = ({
  className,
  description,
  icon: Icon,
  title,
}: LandingPlatformCardProps) => {
  return (
    <Card className="h-full bg-transparent! border-none shadow-none group py-2">
      <CardContent className="h-full">
        <div
          className={cn(
            'inline-block transition-all p-2 rounded-md group-hover:scale-110 duration-300',
            className,
          )}
        >
          <Icon className="text-white size-6" />
        </div>
        <h3 className="mt-2 font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed text-sm">{description}</p>
      </CardContent>
    </Card>
  );
};

const LandingPlatform = () => {
  return (
    <div className="md:px-20 md:pt-16 px-10 py-12">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center gap-4"
      >
        <div className="bg-green-50 flex items-center gap-2 rounded-full px-3 py-2">
          <Smartphone className="text-green-400 size-4 fill-green-400" />
          <span className="text-green-400 text-sm font-bold">Cross Platform</span>
        </div>
        <h2 className="lg:text-5xl md:text-3xl text-xl font-black text-black">
          Beautiful on
          <span className="text-linear ml-2">Every Device</span>
        </h2>
        <p className="text-sm mx-auto max-w-lg text-center text-gray-600">
          Seamlessly switch between desktop, tablet, and mobile. Your conversations follow you
          everywhere.
        </p>
      </motion.div>
      <div className="flex md:flex-row flex-col md:gap-2 gap-10 md:px-2 mt-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative w-full h-[300px] md:h-auto md:flex-1"
        >
          <Image
            fill
            src={images.platform}
            alt="platform"
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-1 flex-col cursor-pointer order-2 md:order-1"
        >
          {homePlatformCards.map((card, index) => (
            <LandingFeatureCard key={index} {...card} />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPlatform;
