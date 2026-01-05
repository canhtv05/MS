export function getValidImageSrc(url: string | null | undefined, fallback: string): string {
  if (!url || url.trim() === '') {
    return fallback;
  }
  return url;
}

export function getImageSrcOrNull(url: string | null | undefined): string | null {
  if (!url || url.trim() === '') {
    return null;
  }
  return url;
}
