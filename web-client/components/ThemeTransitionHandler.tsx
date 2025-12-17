'use client';

import { useTheme } from 'next-themes';
import { useEffect } from 'react';

export function ThemeTransitionHandler() {
  const { theme } = useTheme();

  useEffect(() => {
    const html = document.documentElement;
    html.classList.add('changing-theme');

    const timeout = setTimeout(() => {
      html.classList.remove('changing-theme');
    }, 50);

    return () => clearTimeout(timeout);
  }, [theme]);

  return null;
}
