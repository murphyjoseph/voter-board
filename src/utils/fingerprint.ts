/**
 * Generate a consistent browser fingerprint for anonymous user identification
 * This combines various browser/device characteristics to create a unique identifier
 */
export function generateFingerprint(): string {
  if (typeof window === 'undefined') {
    // Server-side fallback
    return 'server-' + Math.random().toString(36).substring(2, 15);
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx!.textBaseline = 'top';
  ctx!.font = '14px Arial';
  ctx!.fillText('Fingerprint test', 2, 2);

  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 'unknown',
    (navigator as any).deviceMemory || 'unknown',
    canvas.toDataURL()
  ].join('|');

  // Simple hash function to create a shorter, consistent identifier
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return Math.abs(hash).toString(36);
}

/**
 * Check if the current user is the author of an idea
 */
export function isCurrentUserAuthor(authorFingerprint: string): boolean {
  const currentFingerprint = generateFingerprint();
  return currentFingerprint === authorFingerprint;
}
