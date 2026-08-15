import type { ComponentProps } from 'react'

/**
 * Toast icon: the same dog face the amount step uses, pulling a worried ear down
 * and holding a warning badge — a friendlier stand-in for a bare exclamation mark.
 */
export function DogAlert(props: ComponentProps<'svg'>) {
  return (
    <svg
      viewBox="0 0 40 40"
      width={28}
      height={28}
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Ears first, so the filled head hides where they meet it. */}
      <path d="M12 13c-4 1-6.5 4-6.5 8.5 0 3.5 1.5 5.5 4 5.5 2 0 3-2 3-5.5 0-4 0-6.5-.5-8.5Z" />
      <path d="M28 13c4 1 6.5 4 6.5 8.5 0 3.5-1.5 5.5-4 5.5-2 0-3-2-3-5.5 0-4 0-6.5.5-8.5Z" />

      <ellipse cx="20" cy="20" rx="10.5" ry="10" fill="var(--color-white)" />
      <path d="M15.5 17.5c.8-1.6 2-1.6 2.8 0" />
      <path d="M21.7 17.5c.8-1.6 2-1.6 2.8 0" />
      <ellipse cx="20" cy="23.5" rx="5" ry="3.8" />
      <ellipse cx="20" cy="21.5" rx="1.7" ry="1.2" fill="currentColor" stroke="none" />
      <path d="M18.5 25.5h3" />

      {/* Badge sits over the muzzle's lower right, clear of both ears. */}
      <circle cx="31" cy="31" r="6.5" fill="currentColor" stroke="none" />
      <path d="M31 28v3.4" stroke="var(--color-white)" strokeWidth={2.2} />
      <circle cx="31" cy="34.2" r="1.05" fill="var(--color-white)" stroke="none" />
    </svg>
  )
}
