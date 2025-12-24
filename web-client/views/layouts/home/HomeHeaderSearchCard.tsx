'use client';

import { motion } from 'motion/react';
import { IconButton } from '@/components/animate-ui/components/buttons/icon';
import { Magnifer } from '@solar-icons/react-perf/Outline';

interface IHomeHeaderSearchCard {
  value: string;
  index: number;
}

const HomeHeaderSearchCard = ({ value, index }: IHomeHeaderSearchCard) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className="p-2 flex group items-center gap-2 justify-start mx-2 mt-2 dark:hover:bg-gray-500/20 hover:bg-gray-300/20 cursor-pointer rounded-lg">
        <IconButton
          className="rounded-full bg-transparent flex cursor-pointer shadow-none transition-all duration-300"
          variant={'accent'}
        >
          <Magnifer className={'size-6 p-0.5'} />
        </IconButton>
        <span className="text-foreground text-sm">{value}</span>
      </div>
    </motion.div>
  );
};

export default HomeHeaderSearchCard;
