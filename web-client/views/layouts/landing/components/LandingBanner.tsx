'use client';

import { Button } from '@/components/animate-ui/components/buttons/button';
import { SkipNext, ArrowRight } from '@solar-icons/react-perf/Bold';
import { CountingNumber } from '@/components/animate-ui/primitives/texts/counting-number';
import Ring from '@/components/ui/ring';
import dynamic from 'next/dynamic';
import { GradientText } from '@/components/animate-ui/primitives/texts/gradient';
import { motion } from 'framer-motion';

const ClientHomeFeed = dynamic(() => import('./LandingFeed'), { ssr: false });

const LandingBanner = () => {
  return (
    <section
      className="relative flex flex-col xl:gap-10 gap-5 pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden 
        bg-linear-to-br linear-2 cursor-default"
    >
      <div className="flex lg:flex-row flex-col md:gap-5 gap-0">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 lg:pl-20 lg:px-10 px-10 md:pl-20"
        >
          <div className="inline-block px-2 py-1 rounded-full border border-primary bg-white">
            <div className="w-full flex items-center justify-center gap-1">
              <Ring />
              <span className="text-[12px] text-black">Join 1K+ active users worldwide</span>
            </div>
          </div>
          <div className="mt-5">
            <h2 className="text-black md:text-5xl text-4xl font-bold">Connect with</h2>
            <GradientText text="People" className="md:text-5xl text-4xl font-bold" />
            <h2 className="text-black md:text-5xl text-4xl font-bold">Worldwide</h2>
          </div>
          <p className="block text-black/50 mt-5 text-sm">
            Build meaningful connections, share your story, and discover communities that inspire
            you. Your social network reimagined.
          </p>
          <div className="flex md:flex-row mt-10 flex-col gap-2">
            <Button className="rounded-full w-auto" size={'lg'}>
              <div className="flex items-center justify-center w-full gap-2">
                <span>Join the community</span>
                <ArrowRight />
              </div>
            </Button>
            <Button
              className="rounded-full w-auto bg-white! text-black hover:shadow-black/20 hover:shadow-md shadow"
              size={'lg'}
              variant="accent"
            >
              <div className="flex items-center justify-center w-full gap-2">
                <span>Watch demo</span>
                <SkipNext />
              </div>
            </Button>
          </div>
          <div className="grid grid-cols-3 py-10 md:place-items-start place-items-center gap-2">
            <div className="flex flex-col">
              <div className="flex">
                <CountingNumber
                  number={10}
                  className="text-black/80 md:text-lg text-sm font-bold"
                />
                <span className="text-black/80 md:text-lg text-sm font-bold">K+</span>
              </div>
              <span className="text-gray-400 md:text-lg text-sm font-medium">Active users</span>
            </div>
            <div className="flex flex-col">
              <div className="flex">
                <CountingNumber
                  number={50}
                  className="text-black/80 md:text-lg text-sm font-bold"
                />
                <span className="text-black/80 md:text-lg text-sm font-bold">K+</span>
              </div>
              <span className="text-gray-400 md:text-lg text-sm font-medium">Communities</span>
            </div>
            <div className="flex flex-col">
              <div className="flex">
                <CountingNumber number={1} className="text-black/80 md:text-lg text-sm font-bold" />
                <span className="text-black/80 md:text-lg text-sm font-bold">K+</span>
              </div>
              <span className="text-gray-400 md:text-lg text-sm font-medium">Posts Daily</span>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 lg:px-5 md:px-20 px-10"
        >
          <ClientHomeFeed />
        </motion.div>
      </div>
    </section>
  );
};

export default LandingBanner;
