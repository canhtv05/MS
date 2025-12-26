import { useEffect } from 'react';

interface UseClickOutsideOptions {
  excludeRefs?: React.RefObject<HTMLElement | null>[];
  excludeSelectors?: string[];
}

/**
 * Hook to detect clicks outside a given ref element.
 * @param ref - React ref of the element to detect outside clicks
 * @param handler - Callback function when outside click occurs
 * @param options - Optional configuration for excluding elements
 */
function useClickOutside<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent) => void,
  options?: UseClickOutsideOptions,
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;

      // Do nothing if clicking ref's element or descendent
      if (!ref.current || ref.current.contains(target)) {
        return;
      }

      // Check if clicking on excluded refs
      if (options?.excludeRefs?.some(excludeRef => excludeRef.current?.contains(target))) {
        return;
      }

      // Check if clicking on excluded selectors (e.g., '[data-slot="dialog-panel"]')
      if (options?.excludeSelectors?.some(selector => (target as Element).closest?.(selector))) {
        return;
      }

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, options]);
}

export default useClickOutside;
