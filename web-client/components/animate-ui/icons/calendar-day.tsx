'use client';

import type { Variants } from 'motion/react';
import type { HTMLAttributes } from 'react';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import { AnimatePresence, motion, useAnimation } from 'motion/react';

import { cn } from '@/lib/utils';

export interface CalendarDaysIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface CalendarDaysIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const DOTS = [
  { cx: 8, cy: 14 },
  { cx: 12, cy: 14 },
  { cx: 16, cy: 14 },
  { cx: 8, cy: 18 },
  { cx: 12, cy: 18 },
  { cx: 16, cy: 18 },
];

const variants: Variants = {
  normal: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  animate: (i: number) => ({
    opacity: [1, 0.3, 1],
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      times: [0, 0.5, 1],
    },
  }),
};

const CalendarDaysIcon = forwardRef<CalendarDaysIconHandle, CalendarDaysIconProps>(
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
      const parent = element.closest('.group') || element.closest('.animate-icon');
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
          <path d="M8 2v4" />
          <path d="M16 2v4" />
          <rect width="18" height="18" x="3" y="4" rx="2" />
          <path d="M3 10h18" />
          <AnimatePresence>
            {DOTS.map((dot, index) => (
              <motion.circle
                key={`${dot.cx}-${dot.cy}`}
                cx={dot.cx}
                cy={dot.cy}
                r="1"
                fill="currentColor"
                stroke="none"
                initial="normal"
                variants={variants}
                animate={pathControls}
                custom={index}
              />
            ))}
          </AnimatePresence>
        </svg>
      </div>
    );
  },
);

CalendarDaysIcon.displayName = 'CalendarDaysIcon';

export { CalendarDaysIcon };
