'use client'

import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

// Two bubbles so the bark reads as repeated, staggered slightly apart.
const BUBBLES = [
  { top: '8%', left: '6%', delay: 0, rotate: -8 },
  { top: '20%', left: '38%', delay: 0.12, rotate: 6 },
]

export function DogPhoto() {
  const { t } = useTranslation()
  const [isBarking, setBarking] = useState(false)
  // Mounted on first hover only: loading it upfront made an invisible image
  // compete for the largest-contentful-paint slot.
  const [hasHovered, setHasHovered] = useState(false)

  return (
    <div
      className="relative hidden w-[602px] shrink-0 lg:block"
      onMouseEnter={() => {
        setHasHovered(true)
        setBarking(true)
      }}
      onMouseLeave={() => setBarking(false)}
    >
      {/* Decorative — the form carries all the meaning, so both stay out of the accessibility tree. */}
      <Image
        src="/images/dog-form.png"
        alt=""
        fill
        priority
        sizes="602px"
        className="rounded-2xl object-cover"
      />

      {hasHovered && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: isBarking ? 1 : 0, scale: isBarking ? 1 : 1.04 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <Image
            src="/images/dog-hover.avif"
            alt=""
            fill
            loading="eager"
            sizes="602px"
            className="rounded-2xl object-cover"
          />
        </motion.div>
      )}

      <AnimatePresence>
        {isBarking &&
          BUBBLES.map(({ top, left, delay, rotate }) => (
            <motion.span
              key={top}
              style={{ top, left }}
              className="absolute rounded-full bg-white px-5 py-2 text-lg font-extrabold tracking-wide text-indigo-600 shadow-lg"
              initial={{ opacity: 0, scale: 0.4, y: 10, rotate: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotate }}
              exit={{ opacity: 0, scale: 0.6, y: -8 }}
              transition={{ type: 'spring', stiffness: 500, damping: 16, delay }}
            >
              {t('common.woof')}
            </motion.span>
          ))}
      </AnimatePresence>
    </div>
  )
}
