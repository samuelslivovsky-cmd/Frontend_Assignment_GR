'use client'

import { useTranslation } from 'react-i18next'

import { Skeleton } from '@/components/Skeleton'

import { useContributionResults } from './queries'

export function ContributionResults() {
  const { t, i18n } = useTranslation()
  const { data, isPending, isError } = useContributionResults()

  if (isPending) {
    return (
      <dl className="grid gap-8 sm:grid-cols-2" aria-busy aria-label={t('results.loading')}>
        {[t('results.total'), t('results.donors')].map((label) => (
          <div key={label} className="flex flex-col items-center gap-3">
            <Skeleton className="h-14 w-48" />
            <Skeleton className="h-5 w-40" />
          </div>
        ))}
      </dl>
    )
  }

  if (isError) return <p className="text-sm text-red-700">{t('results.error')}</p>

  const eur = new Intl.NumberFormat(i18n.language, {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  })

  const stats = [
    { value: eur.format(data.contribution ?? 0), label: t('results.total') },
    { value: data.contributors.toLocaleString(i18n.language), label: t('results.donors') },
  ]

  return (
    <dl className="grid gap-8 sm:grid-cols-2">
      {stats.map(({ value, label }) => (
        <div key={label} className="flex flex-col items-center gap-2 text-center">
          <dd className="text-4xl font-bold tracking-tight text-indigo-600 sm:text-5xl lg:text-6xl">{value}</dd>
          <dt className="text-gray-700">{label}</dt>
        </div>
      ))}
    </dl>
  )
}
