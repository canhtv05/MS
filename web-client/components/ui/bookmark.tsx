'use client';

import type { Variants } from 'motion/react';
import type { HTMLAttributes } from 'react';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import { motion, useAnimation } from 'motion/react';

import { cn } from '@/lib/utils';

export interface BookmarkIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface BookmarkIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const BOOKMARK_VARIANTS: Variants = {
  normal: { scaleY: 1, scaleX: 1 },
  animate: {
    scaleY: [1, 1.3, 0.9, 1.05, 1],
    scaleX: [1, 0.9, 1.1, 0.95, 1],
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const BookmarkIcon = forwardRef<BookmarkIconHandle, BookmarkIconProps>(
  ({ className, size = 28, onMouseEnter, onMouseLeave, ...props }, ref) => {
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
          <motion.path
            d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"
            animate={svgControls}
            variants={BOOKMARK_VARIANTS}
            style={{ originY: 0.5, originX: 0.5 }}
          />
        </svg>
      </div>
    );
  },
);

BookmarkIcon.displayName = 'BookmarkIcon';

export { BookmarkIcon };
