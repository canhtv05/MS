'use client';

import { AltArrowLeft, AltArrowRight } from '@solar-icons/react-perf/Outline';
import NavigationMenu from './NavigationMenu';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import NavigationHeader from './NavigationHeader';
import useViewport from '@/hooks/use-view-port';
import { Viewport } from '@/enums/common';

const NavigationLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { width } = useViewport();
  const effectiveCollapsed = isCollapsed && width >= Viewport.LG;

  return (
    <div
      className={cn(
        'w-auto transition-[width] duration-300 ease-out relative',
        effectiveCollapsed ? 'lg:w-[72px]' : 'lg:w-64',
      )}
    >
      <div className="h-full flex md:flex-col flex-row md:justify-start justify-center items-start gap-3 w-full">
        <div className="md:block hidden w-full">
          <NavigationHeader isCollapsed={effectiveCollapsed} />
        </div>
        <div className="md:order-2 order-1 md:relative md:bottom-auto fixed bottom-0 z-50 md:z-auto w-full">
          <NavigationMenu isCollapsed={effectiveCollapsed} />

          <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2">
            <div
              className="absolute inset-0 left-0 w-8 h-8"
              style={{ filter: 'drop-shadow(1px 0 5px rgba(0,0,0,0.09))' }}
            >
              <div
                className="w-full h-full custom-bg-1"
                style={{ clipPath: "path('M 16,0 A 16,16 0 0,1 16,32 L 16,0 Z')" }}
              />
            </div>
            <button
              onClick={() => {
                setIsCollapsed(!isCollapsed);
              }}
              className="relative z-10 w-8 h-8 rounded-full custom-bg-1 flex items-center justify-center text-gray-500 hover:text-primary cursor-pointer"
            >
              {isCollapsed ? (
                <AltArrowRight className="size-4" />
              ) : (
                <AltArrowLeft className="size-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationLayout;
