'use client';

import { Compass } from '@/components/animate-ui/icons/compass';
import { AnimateIcon } from '@/components/animate-ui/icons/icon';
import { MessageCircleMore } from '@/components/animate-ui/icons/message-circle-more';
import { Send } from '@/components/animate-ui/icons/send';
import { Star } from '@/components/animate-ui/icons/star';
import { GradientText } from '@/components/animate-ui/primitives/texts/gradient';
import { cn } from '@/lib/utils';
import { FeatureIcon } from '@/components/animate-ui/icons/common';
import { JSX } from 'react';

interface LandingFeatureCardProps {
  icon: JSX.Element;
  title: string;
  description: string;
  className: string;
}

const homeFeatureCards: LandingFeatureCardProps[] = [
  {
    icon: <Send className={'text-white stroke-1'} />,
    title: 'Share Posts',
    description:
      'Share your thoughts, photos, and videos with your network. Express yourself freely and authentically.',
    className: 'bg-cyan-500 border-cyan-300 hover:bg-cyan-300 hover:shadow-cyan-200 shadow-lg',
  },
  {
    icon: <MessageCircleMore className={'text-white stroke-1'} />,
    title: 'Chat Instantly',
    description:
      'Real-time messaging with friends and groups. Stay connected with the people who matter most.',
    className:
      'bg-violet-400 border-violet-200 hover:bg-violet-200 hover:shadow-violet-100 shadow-lg',
  },
  {
    icon: <Compass className={'text-white stroke-1'} />,
    title: 'Discover Communities',
    description:
      'Find and join communities that match your interests. Connect with like-minded individuals globally.',
    className:
      'bg-orange-400 border-orange-200 hover:bg-orange-200 hover:shadow-orange-100 shadow-lg',
  },
  {
    icon: <Star className={'text-white stroke-1'} />,
    title: 'Build Your Brand',
    description:
      'Grow your personal or business brand. Reach your audience and make an impact that matters.',
    className:
      'bg-yellow-500 border-yellow-300 hover:bg-yellow-300 hover:shadow-yellow-200 shadow-lg',
  },
];

const LandingFeatureCard = ({ description, icon, title, className }: LandingFeatureCardProps) => {
  return (
    <AnimateIcon animateOnHover>
      <div className="p-5 rounded-lg linear-3 h-full border-none shadow-none hover:shadow-secondary/20 hover:shadow-lg duration-500 transition-shadow group">
        <div className="h-full border-none shadow-none">
          <div
            className={cn(
              'border inline-block p-2 rounded-md group-hover:scale-110 transition-all duration-300',
              className,
            )}
          >
            {icon}
          </div>
          <h3 className="mt-2 font-bold text-gray-900 mb-3">{title}</h3>
          <p className="text-gray-600 leading-relaxed text-sm">{description}</p>
        </div>
      </div>
    </AnimateIcon>
  );
};

const LandingFeature = () => {
  return (
    <div className="md:px-20 md:py-32 px-10 py-24">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="bg-green-50 flex items-center gap-2 rounded-full px-3 py-2">
          <FeatureIcon className="text-green-400 size-4 fill-green-400" />
          <span className="text-green-400 text-sm font-bold">Features</span>
        </div>
        <h2 className="lg:text-5xl md:text-3xl text-xl font-black text-black">
          Everything You Need to
          <GradientText text="Connect" className="ml-2" />
        </h2>
        <p className="text-sm mx-auto max-w-lg text-center text-gray-600">
          Powerful features designed to help you build authentic relationships and grow your network
        </p>
      </div>
      <div className="grid lg:grid-cols-4 md:px-2 mt-10 md:grid-cols-2 grid-cols-1 gap-4 cursor-pointer">
        {homeFeatureCards.map((card, index) => (
          <LandingFeatureCard key={index} {...card} />
        ))}
      </div>
    </div>
  );
};

export default LandingFeature;
