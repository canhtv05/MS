'use client';

import type { Variants } from 'motion/react';
import type { HTMLAttributes } from 'react';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import { motion, useAnimation } from 'motion/react';

import { cn } from '@/lib/utils';

export interface MapPinIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface MapPinIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const svgVariants: Variants = {
  normal: {
    y: 0,
  },
  animate: {
    y: [0, -5, -3],
    transition: {
      duration: 0.5,
      times: [0, 0.6, 1],
    },
  },
};

const circleVariants: Variants = {
  normal: {
    opacity: 1,
  },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1],
    pathOffset: [0.5, 0],
    transition: {
      delay: 0.3,
      duration: 0.5,
      opacity: { duration: 0.1, delay: 0.3 },
    },
  },
};

const MapPinIcon = forwardRef<MapPinIconHandle, MapPinIconProps>(
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
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={svgVariants}
          initial="normal"
          animate={svgControls}
        >
          <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
          <motion.circle
            cx="12"
            cy="10"
            r="3"
            variants={circleVariants}
            initial="normal"
            animate={pathControls}
          />
        </motion.svg>
      </div>
    );
  },
);

MapPinIcon.displayName = 'MapPinIcon';

export { MapPinIcon };
