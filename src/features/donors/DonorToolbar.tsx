'use client'

import { useTranslation } from 'react-i18next'

import { Skeleton } from '@/components/Skeleton'
import { SelectField } from '@/components/form/SelectField'
import { useShelters } from '@/features/donation/queries'

import { DONOR_SORTS, type DonorSort } from '@/api/donors'

/** `''` is every donation; the shelter filter carries the foundation as its own option. */
export const ALL_SHELTERS = ''
export const FOUNDATION_ONLY = 'FOUNDATION'

const SORT_KEYS: Record<DonorSort, string> = {
  newest: 'donors.sortNewest',
  amount: 'donors.sortAmount',
}

type DonorToolbarProps = {
  shelter: string
  onShelterChange: (value: string) => void
  sort: DonorSort
  onSortChange: (value: DonorSort) => void
}

export function DonorToolbar({ shelter, onShelterChange, sort, onSortChange }: DonorToolbarProps) {
  const { t } = useTranslation()
  const shelters = useShelters()

  const shelterOptions = [
    { value: ALL_SHELTERS, label: t('donors.filterAll') },
    { value: FOUNDATION_ONLY, label: t('donors.filterFoundation') },
    ...(shelters.data ?? []).map(({ id, name }) => ({ value: String(id), label: name })),
  ]

  return (
    <div className="grid gap-4 sm:max-w-xl sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-gray-900">{t('donors.filterShelter')}</span>
        {shelters.isPending ? (
          <div className="flex h-12 items-center justify-between rounded-lg bg-gray-100 px-4">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="size-3 rounded-full" />
          </div>
        ) : (
          <SelectField
            value={shelter}
            onChange={onShelterChange}
            options={shelterOptions}
            aria-label={t('donors.filterShelter')}
          />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-gray-900">{t('donors.sortLabel')}</span>
        <SelectField
          value={sort}
          onChange={(value) => onSortChange(value as DonorSort)}
          options={DONOR_SORTS.map((value) => ({ value, label: t(SORT_KEYS[value]) }))}
          aria-label={t('donors.sortLabel')}
        />
      </div>
    </div>
  )
}
