'use client';

import { useEffect, useState } from 'react';

interface ViewportType {
  width: number;
  height: number;
}

export default function useViewport() {
  const [viewPort, setViewPort] = useState<ViewportType>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setViewPort({ width: window.innerWidth, height: window.innerHeight });

      const handleResize = () =>
        setViewPort({ width: window.innerWidth, height: window.innerHeight });

      window.addEventListener('resize', handleResize);

      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return {
    width: viewPort.width,
    height: viewPort.height,
  };
}
