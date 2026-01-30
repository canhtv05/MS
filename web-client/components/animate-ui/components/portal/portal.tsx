'use client';

import { useLayoutEffect, useState, ReactNode, startTransition, forwardRef } from 'react';
import * as PortalPrimitive from '@radix-ui/react-portal';

interface PortalProps {
  children: ReactNode;
  containerRef?: React.RefObject<HTMLElement | null>;
  className?: string;
  style?: React.CSSProperties;
  offset?: number;
  container?: HTMLElement;
}

const Portal = forwardRef<HTMLDivElement, PortalProps>(
  ({ children, containerRef, className, style, offset = 4, container }, ref) => {
    const mounted = typeof window !== 'undefined';
    const [position, setPosition] = useState<{ top: number; left: number; width?: number } | null>(
      null,
    );
    useLayoutEffect(() => {
      if (!containerRef?.current) {
        startTransition(() => {
          setPosition(null);
        });
        return;
      }

      const calculatePosition = () => {
        if (!containerRef.current) return null;
        const rect = containerRef.current.getBoundingClientRect();
        return {
          top: rect.bottom + offset,
          left: rect.left,
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
    }, [containerRef, offset]);

    if (!mounted || !position) return null;
    const dropdownContent = (
      <div
        ref={ref}
        className={className}
        style={{
          position: 'fixed',
          top: `${position.top}px`,
          left: `${position.left}px`,
          width: position.width ? `${position.width}px` : undefined,
          ...style,
        }}
      >
        {children}
      </div>
    );

    return <PortalPrimitive.Root container={container}>{dropdownContent}</PortalPrimitive.Root>;
  },
);

Portal.displayName = 'Portal';

export default Portal;
