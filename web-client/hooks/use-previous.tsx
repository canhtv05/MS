'use client';

import { useEffect, useRef, useState } from 'react';

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>(value);
  const [prev, setPrev] = useState<T | undefined>(undefined);

  useEffect(() => {
    setPrev(ref.current);
    ref.current = value;
  }, [value]);

  return prev;
}

export default usePrevious;
