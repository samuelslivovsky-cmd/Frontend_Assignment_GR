/**
 * Placeholder block shown while data is in flight. Hidden from assistive tech —
 * the surrounding region carries `aria-busy`, which is what screen readers act on.
 */
export function Skeleton({ className = '' }: { className?: string }) {
  return <span aria-hidden className={`block animate-pulse rounded-lg bg-gray-200 ${className}`} />
}
