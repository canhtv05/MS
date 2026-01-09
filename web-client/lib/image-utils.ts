export function getValidImageSrc(url: string | null | undefined, fallback: string): string {
  const safeFallback =
    fallback && typeof fallback === 'string' && fallback.trim() !== '' ? fallback : '';
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return safeFallback;
  }
  return url;
}

export function getImageSrcOrNull(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return null;
  }
  return url;
}
