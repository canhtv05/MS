export const CACHE_POLICY = {
  STATIC: {
    staleTime: Infinity, // Không bao giờ stale
    gcTime: 24 * 60 * 60 * 1000, // giữ 24h
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  },
  PROFILE: {
    staleTime: 5 * 60 * 1000, // 5 phút
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  },
  DYNAMIC: {
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  },
} as const;
