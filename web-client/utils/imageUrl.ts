/**
 * Use proxy for Minio / localhost:9000 URLs to avoid CORS when loading in <img>.
 * Presigned URLs from Minio are loaded server-side by the proxy, then served same-origin.
 */
export function getDisplayImageUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl || typeof imageUrl !== 'string') return '';
  const trimmed = imageUrl.trim();
  if (!trimmed) return '';
  try {
    const u = new URL(trimmed);
    const isMinio = u.hostname === 'localhost' && u.port === '9000';
    const isMinioAlt = u.hostname === '127.0.0.1' && u.port === '9000';
    if (isMinio || isMinioAlt) {
      return `/api/image-proxy?url=${encodeURIComponent(trimmed)}`;
    }
  } catch {
    // not a valid URL, return as-is (e.g. relative path)
  }
  return trimmed;
}
