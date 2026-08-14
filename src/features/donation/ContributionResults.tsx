'use client'

import { useContributionResults } from './queries'

const EUR = new Intl.NumberFormat('sk-SK', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

export function ContributionResults() {
  const { data, isPending, isError } = useContributionResults()

  if (isPending) return <p className="text-sm text-gray-500">Načítavam prehľad…</p>
  if (isError) return <p className="text-sm text-red-700">Prehľad príspevkov sa nepodarilo načítať.</p>

  const stats = [
    { value: EUR.format(data.contribution ?? 0), label: 'Celková vyzbieraná hodnota' },
    { value: data.contributors.toLocaleString('sk-SK'), label: 'Počet darcov' },
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
