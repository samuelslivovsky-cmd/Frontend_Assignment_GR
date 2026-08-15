'use client'

import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'

import { Skeleton } from '@/components/Skeleton'
import { formatDonationDate } from '@/lib/formatDate'

import type { Donor } from '@/api/donors'

const ROW = 'flex items-center gap-4 border-b border-gray-200 py-4 last:border-0'

type DonorRowProps = {
  donor: Donor
  shelterName?: string
  /** Position within its page, so a freshly loaded batch cascades in. */
  index: number
}

export function DonorRow({ donor, shelterName, index }: DonorRowProps) {
  const { t, i18n } = useTranslation()

  const eur = new Intl.NumberFormat(i18n.language, {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  })

  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut', delay: index * 0.03 }}
      className={ROW}
    >
      <span
        aria-hidden
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-extrabold text-indigo-600"
      >
        {donor.firstName[0]}
        {donor.lastName[0]}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-gray-900">
          {donor.firstName} {donor.lastName}
        </span>
        <span className="block truncate text-xs text-gray-500">
          {shelterName ?? t('donors.foundation')} ·{' '}
          <time dateTime={donor.donatedAt}>
            {formatDonationDate(donor.donatedAt, i18n.language)}
          </time>
        </span>
      </span>

      <span className="shrink-0 text-sm font-semibold text-indigo-600 tabular-nums">
        {eur.format(donor.amount)}
      </span>
    </motion.li>
  )
}

export function DonorRowSkeleton() {
  return (
    <li className={ROW}>
      <Skeleton className="size-10 shrink-0 rounded-full" />
      <span className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-28" />
      </span>
      <Skeleton className="h-4 w-16" />
    </li>
  )
}
