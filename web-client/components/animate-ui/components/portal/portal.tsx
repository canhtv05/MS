'use client';

import { useLayoutEffect, useState, ReactNode, startTransition } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
  containerRef?: React.RefObject<HTMLElement | null>;
  className?: string;
  style?: React.CSSProperties;
  offset?: number;
  ref?: React.Ref<HTMLDivElement>;
}

const Portal = ({ children, containerRef, className, style, offset = 4, ref }: PortalProps) => {
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
  }, [containerRef, offset]);

  if (!mounted || !position) return null;
  const dropdownContent = (
    <div
      ref={ref}
      className={className}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: position.width ? `${position.width}px` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );

  return createPortal(dropdownContent, document.body);
};

export default Portal;
