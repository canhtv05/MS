'use client';

import { Compass } from '@/components/animate-ui/icons/compass';
import { AnimateIcon } from '@/components/animate-ui/icons/icon';
import { MessageCircleMore } from '@/components/animate-ui/icons/message-circle-more';
import { Send } from '@/components/animate-ui/icons/send';
import { Star } from '@/components/animate-ui/icons/star';
import { FeatureIcon } from '@/public/icons';
import { JSX } from 'react';

interface HomeFeatureCardProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

const homeFeatureCards: HomeFeatureCardProps[] = [
  {
    icon: <Send className={'text-white'} />,
    title: 'Share Posts',
    description:
      'Share your thoughts, photos, and videos with your network. Express yourself freely and authentically.',
  },
  {
    icon: <MessageCircleMore className={'text-white'} />,
    title: 'Chat Instantly',
    description:
      'Real-time messaging with friends and groups. Stay connected with the people who matter most.',
  },
  {
    icon: <Compass className={'text-white'} />,
    title: 'Discover Communities',
    description:
      'Find and join communities that match your interests. Connect with like-minded individuals globally.',
  },
  {
    icon: <Star className={'text-white'} />,
    title: 'Build Your Brand',
    description:
      'Grow your personal or business brand. Reach your audience and make an impact that matters.',
  },
];

const HomeFeatureCard = ({ description, icon, title }: HomeFeatureCardProps) => {
  return (
    <AnimateIcon animateOnHover>
      <div className="p-5 rounded-lg linear-3 h-full border-none shadow-none hover:shadow-secondary/20 hover:shadow-lg duration-500 transition-shadow group">
        <div className="h-full border-none shadow-none">
          <div className="linear-1 inline-block p-2 rounded-md group-hover:scale-110 transition-all duration-300">
            {icon}
          </div>
          <h3 className="mt-2 font-bold text-gray-900 mb-3">{title}</h3>
          <p className="text-gray-600 leading-relaxed text-sm">{description}</p>
        </div>
      </div>
    </AnimateIcon>
  );
};

const HomeFeature = () => {
  return (
    <div className="md:px-20 md:py-32 px-10 py-24">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="bg-primary/10 flex items-center gap-2 rounded-full px-3 py-2">
          <FeatureIcon className="text-primary size-4" />
          <span className="text-primary text-sm font-bold">Features</span>
        </div>
        <h2 className="lg:text-5xl md:text-3xl text-xl font-black text-black">
          Everything You Need to
          <span className="text-linear ml-2">Connect</span>
        </h2>
        <p className="text-sm mx-auto max-w-lg text-center text-gray-600">
          Powerful features designed to help you build authentic relationships and grow your network
        </p>
      </div>
      <div className="grid lg:grid-cols-4 md:px-2 mt-10 md:grid-cols-2 grid-cols-1 gap-4 cursor-pointer">
        {homeFeatureCards.map((card, index) => (
          <HomeFeatureCard key={index} {...card} />
        ))}
      </div>
    </div>
  );
};

export default HomeFeature;
