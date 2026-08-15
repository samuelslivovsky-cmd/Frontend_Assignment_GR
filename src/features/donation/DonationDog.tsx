'use client'

import { motion } from 'motion/react'

/**
 * Reacts to the donation amount: ears perk up and the smile opens. Purely
 * decorative feedback — the amount itself is already announced by the input,
 * so it stays out of the accessibility tree.
 */

const LEVELS = [
  { ear: 0, eyes: 'sleepy', mouth: 'flat' },
  { ear: 10, eyes: 'open', mouth: 'smile' },
  { ear: 20, eyes: 'open', mouth: 'grin' },
  { ear: 30, eyes: 'happy', mouth: 'grin' },
  { ear: 40, eyes: 'happy', mouth: 'grin' },
] as const

const THRESHOLDS = [1, 10, 30, 100]

// Explicit classes rather than a merged className, so the two sizes can never collide.
const SIZES = { md: 'size-16 sm:size-24', lg: 'size-32 sm:size-40' }

function levelFor(amount: number): number {
  if (!Number.isFinite(amount) || amount <= 0) return 0

  return THRESHOLDS.filter((threshold) => amount >= threshold).length
}

function Sparkle({ x, y, scale }: { x: number; y: number; scale: number }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${scale})`}
      d="M0 -6c1 4 2 5 6 6c-4 1-5 2-6 6c-1-4-2-5-6-6c4-1 5-2 6-6Z"
      fill="currentColor"
      stroke="none"
    />
  )
}

type DonationDogProps = {
  amount: number
  size?: keyof typeof SIZES
}

export function DonationDog({ amount, size = 'md' }: DonationDogProps) {
  const index = levelFor(amount)
  const { ear, eyes, mouth } = LEVELS[index]
  const isTongueOut = index >= 3
  const isEcstatic = index === 4

  const springy = { type: 'spring', stiffness: 320, damping: 14 } as const

  return (
    <motion.svg
      viewBox="0 0 100 100"
      aria-hidden
      className={`${SIZES[size]} text-indigo-600`}
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      // Re-keyed on the level so crossing a threshold replays the little hop.
      key={index}
      initial={{ scale: 0.88 }}
      animate={{ scale: 1 }}
      transition={springy}
    >
      {/* Ears are drawn first and pivot where they meet the head; the head is
          filled so it hides the joint instead of showing crossing outlines.
          Each ear rotates away from the head, so the signs are mirrored. */}
      <motion.path
        d="M30 38c-10 2-16 10-16 21 0 8 4 13 10 13 5 0 8-5 8-13 0-9 0-16-2-21Z"
        style={{ transformOrigin: '30px 38px' }}
        animate={{ rotate: ear }}
        transition={springy}
      />
      <motion.path
        d="M70 38c10 2 16 10 16 21 0 8-4 13-10 13-5 0-8-5-8-13 0-9 0-16 2-21Z"
        style={{ transformOrigin: '70px 38px' }}
        animate={{ rotate: -ear }}
        transition={springy}
      />

      <ellipse cx="50" cy="52" rx="25" ry="24" fill="#fff" />

      {eyes === 'sleepy' && (
        <>
          <path d="M37 47c2 3 5 3 7 0" />
          <path d="M56 47c2 3 5 3 7 0" />
        </>
      )}
      {eyes === 'open' && (
        <>
          <circle cx="41" cy="46" r="3" fill="currentColor" stroke="none" />
          <circle cx="59" cy="46" r="3" fill="currentColor" stroke="none" />
        </>
      )}
      {eyes === 'happy' && (
        <>
          <path d="M37 48c2-4 5-4 7 0" />
          <path d="M56 48c2-4 5-4 7 0" />
        </>
      )}

      <ellipse cx="50" cy="61" rx="12" ry="9" />
      <ellipse cx="50" cy="56" rx="4" ry="3" fill="currentColor" stroke="none" />
      <path d="M50 59v3" />

      {mouth === 'flat' && <path d="M45 64h10" />}
      {mouth === 'smile' && (
        <>
          <path d="M44 63c1 3 4 3 6 0" />
          <path d="M50 63c2 3 5 3 6 0" />
        </>
      )}
      {mouth === 'grin' && (
        <>
          <path d="M42 63c2 5 6 5 8 0" />
          <path d="M50 63c2 5 6 5 8 0" />
        </>
      )}

      {isTongueOut && <path d="M46 67h8v4a4 4 0 0 1-8 0Z" fill="currentColor" fillOpacity={0.25} />}

      {isEcstatic && (
        <>
          <Sparkle x={16} y={24} scale={1} />
          <Sparkle x={86} y={20} scale={0.75} />
        </>
      )}
    </motion.svg>
  )
}
