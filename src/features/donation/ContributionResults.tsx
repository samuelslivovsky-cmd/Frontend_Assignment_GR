'use client'

import { useContributionResults } from './queries'

const EUR = new Intl.NumberFormat('sk-SK', { style: 'currency', currency: 'EUR' })

export function ContributionResults() {
  const { data, isPending, isError } = useContributionResults()

  if (isPending) return <p className="text-sm text-slate-500">Načítavam prehľad…</p>
  if (isError) return <p className="text-sm text-red-700">Prehľad príspevkov sa nepodarilo načítať.</p>

  return (
    <dl className="flex gap-8">
      <div>
        <dt className="text-sm text-slate-600">Vyzbieraná suma</dt>
        <dd className="text-2xl font-semibold">{EUR.format(data.contribution ?? 0)}</dd>
      </div>
      <div>
        <dt className="text-sm text-slate-600">Počet darcov</dt>
        <dd className="text-2xl font-semibold">{data.contributors}</dd>
      </div>
    </dl>
  )
}
