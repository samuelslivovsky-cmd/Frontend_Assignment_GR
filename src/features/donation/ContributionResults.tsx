'use client'

import { useTranslation } from 'react-i18next'

import { useContributionResults } from './queries'

export function ContributionResults() {
  const { t, i18n } = useTranslation()
  const { data, isPending, isError } = useContributionResults()

  if (isPending) return <p className="text-sm text-gray-500">{t('results.loading')}</p>
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
          <dd className="text-6xl font-bold tracking-tight text-indigo-600">{value}</dd>
          <dt className="text-gray-700">{label}</dt>
        </div>
      ))}
    </dl>
  )
}
