'use client';

import { cn } from '@/lib/utils';
import { forwardRef, useLayoutEffect, useState, ReactNode, startTransition } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
  isOpen: boolean;
  containerRef?: React.RefObject<HTMLElement | null>;
  className?: string;
  offset?: number;
}

const Portal = forwardRef<HTMLDivElement, PortalProps>(
  ({ children, isOpen, containerRef, className, offset = 4 }, ref) => {
    const mounted = typeof window !== 'undefined';
    const [position, setPosition] = useState<{ top: number; left: number; width?: number } | null>(
      null,
    );
    useLayoutEffect(() => {
      if (!containerRef?.current || !isOpen) {
        startTransition(() => {
          setPosition(null);
        });
        return;
      }

      const calculatePosition = () => {
        if (!containerRef.current) return null;
        const rect = containerRef.current.getBoundingClientRect();
        return {
          top: rect.bottom + window.scrollY + offset,
          left: rect.left + window.scrollX,
          width: rect.width,
        };
      };
      const initialPosition = calculatePosition();
      if (initialPosition) {
        setPosition(initialPosition);
      }

      const updatePosition = () => {
        const newPosition = calculatePosition();
        if (newPosition) {
          setPosition(newPosition);
        }
      };

      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);

      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition, true);
      };
    }, [containerRef, isOpen, offset]);

    if (!mounted || !isOpen || !position) return null;
    const dropdownContent = (
      <div
        ref={ref}
        className={cn('fixed z-9999 rounded-lg', className)}
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          width: position.width ? `${position.width}px` : undefined,
          transition: 'none',
        }}
      >
        {children}
      </div>
    );

    return createPortal(dropdownContent, document.body);
  },
);

Portal.displayName = 'Portal';

export default Portal;
