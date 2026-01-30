'use client';

import { useEffect, useState, Suspense, useRef, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

interface TopLoadingBarProps {
  /** Enable loading bar for query parameter changes (tab switches) */
  enableQueryChange?: boolean;
  /** Base delay in ms for query-only changes (default: 100) */
  queryChangeDelay?: number;
  /** Base delay in ms for pathname changes (default: 200) */
  pathnameChangeDelay?: number;
  /** Hide delay in ms for query-only changes after reaching 100% (default: 100) */
  queryChangeHideDelay?: number;
  /** Hide delay in ms for pathname changes after reaching 100% (default: 150) */
  pathnameChangeHideDelay?: number;
  /** Color gradient for the loading bar (default: 'from-purple-500 via-pink-500 to-purple-500') */
  color?: string;
  /** Height of the loading bar in pixels (default: 1) */
  height?: number;
  /** Z-index of the loading bar (default: 9999) */
  zIndex?: number;
  /** Maximum timeout in ms before forcing completion (default: 2000) */
  maxTimeout?: number;
}

const defaultProps: Required<TopLoadingBarProps> = {
  enableQueryChange: true,
  queryChangeDelay: 100,
  pathnameChangeDelay: 200,
  queryChangeHideDelay: 100,
  pathnameChangeHideDelay: 150,
  color: 'from-purple-500 via-pink-500 to-purple-500',
  height: 1,
  zIndex: 9999,
  maxTimeout: 2000,
};

function TopLoadingBarContent(props: TopLoadingBarProps = {}) {
  const {
    enableQueryChange,
    queryChangeDelay,
    pathnameChangeDelay,
    queryChangeHideDelay,
    pathnameChangeHideDelay,
    color,
    height,
    zIndex,
    maxTimeout,
  } = { ...defaultProps, ...props };
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const cleanupRef = useRef<(() => void) | null>(null);
  const isInitialMount = useRef(true);
  const previousPathname = useRef(pathname);
  const previousSearchParams = useRef(searchParams?.toString() || '');
  const navigationStartTimeRef = useRef<number | null>(null);
  const isLoadingActiveRef = useRef(false);

  // Function to start progress animation
  const startProgress = (mountedRef: { current: boolean }) => {
    const progressTimer = setInterval(() => {
      if (!mountedRef.current) {
        clearInterval(progressTimer);
        return;
      }

      if (progressRef.current < 90) {
        let increment: number;
        if (progressRef.current < 30) {
          increment = 10;
        } else if (progressRef.current < 60) {
          increment = 5;
        } else if (progressRef.current < 80) {
          increment = 2;
        } else {
          increment = 0.5;
        }
        progressRef.current = Math.min(90, progressRef.current + increment);
        setProgress(progressRef.current);
      } else {
        clearInterval(progressTimer);
      }
    }, 16); // ~60fps

    return progressTimer;
  };

  // Function to complete loading when page is ready
  const completeLoading = useCallback(
    (mountedRef: { current: boolean }, isQueryOnlyChange: boolean = false) => {
      // Check if document is ready
      const checkReady = () => {
        if (!mountedRef.current) return;

        // Force to 100% when page is ready
        progressRef.current = 100;
        setProgress(100);

        // Wait a moment to show 100%, then hide
        // Use custom delays based on change type
        const hideDelay = isQueryOnlyChange ? queryChangeHideDelay : pathnameChangeHideDelay;
        setTimeout(() => {
          if (!mountedRef.current) return;
          isLoadingActiveRef.current = false;
          setLoading(false);
          // Reset progress after hiding
          setTimeout(() => {
            if (!mountedRef.current) return;
            progressRef.current = 0;
            setProgress(0);
            navigationStartTimeRef.current = null;
          }, 200);
        }, hideDelay);
      };

      // Calculate minimum delay to show progress bar (even for cached pages)
      // Use custom delays based on change type
      const baseDelay = isQueryOnlyChange ? queryChangeDelay : pathnameChangeDelay;
      const minDelay = navigationStartTimeRef.current
        ? Math.max(baseDelay, Date.now() - navigationStartTimeRef.current)
        : baseDelay;

      // For Next.js App Router (client-side navigation), we need to wait for React to render
      // Use requestIdleCallback to detect when browser is idle (page rendered)
      // Fallback to setTimeout if not available
      const scheduleComplete = () => {
        if (typeof requestIdleCallback !== 'undefined') {
          requestIdleCallback(
            () => {
              // Additional small delay to ensure React has finished rendering
              setTimeout(checkReady, 50);
            },
            { timeout: minDelay + 100 },
          );
        } else {
          // Fallback: wait for next frame + small delay
          setTimeout(() => {
            requestAnimationFrame(() => {
              setTimeout(checkReady, 50);
            });
          }, minDelay);
        }
      };

      scheduleComplete();

      // Fallback timeout: complete after reasonable delay
      setTimeout(() => {
        if (mountedRef.current && isLoadingActiveRef.current) {
          checkReady();
        }
      }, maxTimeout);
    },
    [
      queryChangeDelay,
      pathnameChangeDelay,
      queryChangeHideDelay,
      pathnameChangeHideDelay,
      maxTimeout,
    ],
  );

  // Listen for link clicks to start loading immediately
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href]');

      if (!link) return;

      const href = link.getAttribute('href');
      if (href && href.startsWith('/')) {
        // Extract pathname and search params from href
        try {
          const url = new URL(href, window.location.origin);
          const hrefPathname = url.pathname;
          const hrefSearch = url.search;

          // Get current search params
          const currentSearch = searchParams?.toString() || '';

          // Start loading if pathname changes OR if query params change (tab switches)
          const pathnameChanged = hrefPathname && hrefPathname !== pathname;
          const queryChanged = enableQueryChange && hrefSearch !== currentSearch;

          if (pathnameChanged || queryChanged) {
            // Cleanup previous loading if exists
            if (cleanupRef.current) {
              cleanupRef.current();
            }

            // Start loading immediately when link is clicked
            navigationStartTimeRef.current = Date.now();
            progressRef.current = 0;
            isLoadingActiveRef.current = true;
            setLoading(true);
            setProgress(0);

            // Start progress animation
            let mounted = true;
            const progressTimer = startProgress({ current: mounted });

            // Store cleanup function
            cleanupRef.current = () => {
              mounted = false;
              clearInterval(progressTimer);
            };
          }
        } catch {
          // Invalid URL, skip
        }
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [pathname, searchParams, enableQueryChange]);

  // Handle pathname and searchParams changes (when navigation completes)
  useEffect(() => {
    const currentSearchParams = searchParams?.toString() || '';

    // Skip on initial mount to avoid showing loading bar on first render
    if (isInitialMount.current) {
      isInitialMount.current = false;
      previousPathname.current = pathname;
      previousSearchParams.current = currentSearchParams;
      return;
    }

    const pathnameChanged = previousPathname.current !== pathname;
    const searchParamsChanged = previousSearchParams.current !== currentSearchParams;

    // Update refs
    previousPathname.current = pathname;
    previousSearchParams.current = currentSearchParams;

    // Only trigger loading bar if pathname or searchParams changed
    if (!pathnameChanged && !searchParamsChanged) {
      return;
    }

    // If only searchParams changed, show a shorter loading bar for tab changes
    // But only if query changes are enabled
    const isQueryOnlyChange = enableQueryChange && !pathnameChanged && searchParamsChanged;

    // Cleanup previous loading if exists
    if (cleanupRef.current) {
      cleanupRef.current();
    }

    // If loading is already active (from click handler), complete it when page is ready
    // Otherwise, start new loading (for programmatic navigation, pathname change, or query change)
    let mounted = true;

    if (
      !isLoadingActiveRef.current &&
      (pathnameChanged || (enableQueryChange && isQueryOnlyChange))
    ) {
      // Start loading if not already started
      navigationStartTimeRef.current = Date.now();
      progressRef.current = 0;
      isLoadingActiveRef.current = true;
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => {
        setLoading(true);
        setProgress(0);
      }, 0);
    }

    // Continue progress animation if not at 90% yet
    const progressTimer = progressRef.current < 90 ? startProgress({ current: mounted }) : null;

    // Complete loading when page is ready
    completeLoading({ current: mounted }, isQueryOnlyChange);

    // Store cleanup function
    cleanupRef.current = () => {
      mounted = false;
      if (progressTimer) clearInterval(progressTimer);
    };

    return cleanupRef.current;
  }, [pathname, searchParams, enableQueryChange, completeLoading]);

  return (
    <div
      className="fixed top-0 left-0 right-0 bg-transparent pointer-events-none"
      style={{
        height: `${height}px`,
        zIndex,
        opacity: loading ? 1 : 0,
        visibility: loading ? 'visible' : 'hidden',
        transition: 'opacity 0.2s ease-out, visibility 0.2s ease-out',
      }}
    >
      <div
        className={`h-full bg-linear-to-r ${color} shadow-lg shadow-purple-500/50`}
        style={{
          width: `${progress}%`,
          transition: progress < 100 ? 'width 0.3s ease-out' : 'width 0.2s ease-in',
          backgroundSize: '200% 100%',
          animation: progress < 100 ? 'shimmer 2s infinite' : 'none',
        }}
      />
    </div>
  );
}

export default function TopLoadingBar(props?: TopLoadingBarProps) {
  return (
    <Suspense fallback={null}>
      <TopLoadingBarContent {...props} />
    </Suspense>
  );
}
