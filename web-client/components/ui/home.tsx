'use client';

import type { Transition, Variants } from 'motion/react';
import type { HTMLAttributes } from 'react';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import { motion, useAnimation } from 'motion/react';

import { cn } from '@/lib/utils';

export interface HomeIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface HomeIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const defaultTransition: Transition = {
  duration: 0.6,
  opacity: { duration: 0.2 },
};

const pathVariants: Variants = {
  normal: {
    pathLength: 1,
    opacity: 1,
  },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1],
  },
};

const HomeIcon = forwardRef<HomeIconHandle, HomeIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
    const svgControls = useAnimation();
    const pathControls = useAnimation();
    const divRef = useRef<HTMLDivElement>(null);
    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;

      return {
        startAnimation: () => {
          svgControls.start('animate');
          pathControls.start('animate');
        },
        stopAnimation: () => {
          svgControls.start('normal');
          pathControls.start('normal');
        },
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
        }
        onMouseEnter?.(e);
      },
      [svgControls, pathControls, onMouseEnter],
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isControlledRef.current) {
          svgControls.start('normal');
          pathControls.start('normal');
        }
        onMouseLeave?.(e);
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
          <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <motion.path
            d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"
            variants={pathVariants}
            transition={defaultTransition}
            animate={pathControls}
          />
        </svg>
      </div>
    );
  },
);

HomeIcon.displayName = 'HomeIcon';

export { HomeIcon };
