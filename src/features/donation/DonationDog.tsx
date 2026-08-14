'use client'

/**
 * Reacts to the donation amount: ears perk up and the smile opens. Purely
 * decorative feedback — the amount itself is already announced by the input,
 * so it stays out of the accessibility tree.
 */

const LEVELS = [
  { ear: 0, eyes: 'sleepy', mouth: 'flat' },
  { ear: 8, eyes: 'open', mouth: 'smile' },
  { ear: 16, eyes: 'open', mouth: 'grin' },
  { ear: 24, eyes: 'happy', mouth: 'grin' },
  { ear: 32, eyes: 'happy', mouth: 'grin' },
] as const

const THRESHOLDS = [1, 10, 30, 100]

function levelFor(amount: number): number {
  if (!Number.isFinite(amount) || amount <= 0) return 0

  return THRESHOLDS.filter((threshold) => amount >= threshold).length
}

// Explicit classes rather than a merged className, so the two sizes can never collide.
const SIZES = { md: 'size-24', lg: 'size-40' }

type DonationDogProps = {
  amount: number
  size?: keyof typeof SIZES
}

export function DonationDog({ amount, size = 'md' }: DonationDogProps) {
  const index = levelFor(amount)
  const { ear, eyes, mouth } = LEVELS[index]
  const isTongueOut = index >= 3
  const isEcstatic = index === 4

  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden
      className={`${SIZES[size]} text-indigo-600`}
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g className="origin-center transition-transform duration-300" style={{ transform: `rotate(${-ear}deg)` }}>
        <path d="M33 32c-9 2-14 9-14 19 0 7 4 11 8 10 4-1 5-5 4-11-1-7 1-14 2-18Z" />
      </g>
      <g className="origin-center transition-transform duration-300" style={{ transform: `rotate(${ear}deg)` }}>
        <path d="M67 32c9 2 14 9 14 19 0 7-4 11-8 10-4-1-5-5-4-11 1-7-1-14-2-18Z" />
      </g>

      <path d="M50 26c-13 0-23 9-23 22s10 25 23 25 23-12 23-25-10-22-23-22Z" />

      {eyes === 'sleepy' && (
        <>
          <path d="M38 48c2 2 4 2 6 0" />
          <path d="M56 48c2 2 4 2 6 0" />
        </>
      )}
      {eyes === 'open' && (
        <>
          <circle cx="41" cy="47" r="2.5" fill="currentColor" stroke="none" />
          <circle cx="59" cy="47" r="2.5" fill="currentColor" stroke="none" />
        </>
      )}
      {eyes === 'happy' && (
        <>
          <path d="M37 49c2-4 5-4 7 0" />
          <path d="M56 49c2-4 5-4 7 0" />
        </>
      )}

      <ellipse cx="50" cy="58" rx="4" ry="3" fill="currentColor" stroke="none" />
      <path d="M50 61v3" />

      {mouth === 'flat' && <path d="M44 66h12" />}
      {mouth === 'smile' && (
        <>
          <path d="M43 64c2 4 5 4 7 0" />
          <path d="M50 64c2 4 5 4 7 0" />
        </>
      )}
      {mouth === 'grin' && (
        <>
          <path d="M41 64c3 6 6 6 9 0" />
          <path d="M50 64c3 6 6 6 9 0" />
        </>
      )}

      {isTongueOut && (
        <path d="M46 69h8v5a4 4 0 0 1-8 0Z" fill="currentColor" fillOpacity={0.25} />
      )}

      {isEcstatic && (
        <>
          <path d="M15 24v8M11 28h8" />
          <path d="M85 18v6M82 21h6" />
        </>
      )}
    </svg>
  )
}
