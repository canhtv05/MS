export function getValidImageSrc(url: string | null | undefined, fallback: string): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return fallback;
  }
  return url;
}

export function getImageSrcOrNull(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return null;
  }
  return url;
}
