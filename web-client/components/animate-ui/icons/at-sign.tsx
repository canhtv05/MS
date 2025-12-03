'use client';

import type { Variants } from 'motion/react';
import type { HTMLAttributes } from 'react';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import { motion, useAnimation } from 'motion/react';

import { cn } from '@/lib/utils';

export interface AtSignIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface AtSignIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const circleVariants: Variants = {
  normal: {
    opacity: 1,
    pathLength: 1,
    pathOffset: 0,
    transition: {
      duration: 0.4,
      opacity: { duration: 0.1 },
    },
  },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1],
    pathOffset: [1, 0],
    transition: {
      duration: 0.3,
      opacity: { duration: 0.1 },
    },
  },
};

const pathVariants: Variants = {
  normal: {
    opacity: 1,
    pathLength: 1,
    transition: {
      delay: 0.3,
      duration: 0.3,
      opacity: { duration: 0.1, delay: 0.3 },
    },
  },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1],
    transition: {
      delay: 0.3,
      duration: 0.3,
      opacity: { duration: 0.1, delay: 0.3 },
    },
  },
};

const AtSignIcon = forwardRef<AtSignIconHandle, AtSignIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
    const svgControls = useAnimation();
    const pathControls = useAnimation();
    const divRef = useRef<HTMLDivElement>(null);
    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;

      return {
        startAnimation: () => svgControls.start('animate'),
        stopAnimation: () => svgControls.start('normal'),
      };
    });

    // Detect parent hover via group-hover class
    useEffect(() => {
      const element = divRef.current;
      if (!element) return;

      // Find parent with 'group' class
      const parent = element.closest('.group');
      if (!parent) return;

      const handleParentMouseEnter = () => {
        svgControls.start('animate');
        pathControls.start('animate');
      };

      const handleParentMouseLeave = () => {
        svgControls.start('normal');
        pathControls.start('normal');
      };

      parent.addEventListener('mouseenter', handleParentMouseEnter);
      parent.addEventListener('mouseleave', handleParentMouseLeave);

      return () => {
        parent.removeEventListener('mouseenter', handleParentMouseEnter);
        parent.removeEventListener('mouseleave', handleParentMouseLeave);
      };
    }, [svgControls, pathControls]);

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isControlledRef.current) {
          svgControls.start('animate');
          pathControls.start('animate');
        } else {
          onMouseEnter?.(e);
        }
      },
      [svgControls, pathControls, onMouseEnter],
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isControlledRef.current) {
          svgControls.start('normal');
          pathControls.start('normal');
        } else {
          onMouseLeave?.(e);
        }
      },
      [svgControls, pathControls, onMouseLeave],
    );

    return (
      <div
        ref={divRef}
        className={cn(className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.circle variants={circleVariants} animate={svgControls} cx="12" cy="12" r="4" />
          <motion.path
            variants={pathVariants}
            animate={pathControls}
            d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"
          />
        </svg>
      </div>
    );
  },
);

AtSignIcon.displayName = 'AtSignIcon';

export { AtSignIcon };
