'use client'

import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/form/inputs'
import { useShelters } from '@/features/donation/queries'

import { DONORS_PAGE_SIZE, type DonorFilters, type DonorSort } from '@/api/donors'

import { DonorRow, DonorRowSkeleton } from './DonorRow'
import { ALL_SHELTERS, DonorToolbar, FOUNDATION_ONLY } from './DonorToolbar'
import { useDonors } from './queries'

const HEADING_ID = 'donors-list'
const SKELETON_ROWS = 5

const toShelterFilter = (value: string): DonorFilters['shelter'] => {
  if (value === ALL_SHELTERS) return null
  if (value === FOUNDATION_ONLY) return FOUNDATION_ONLY
  return Number(value)
}

export function DonorList() {
  const { t } = useTranslation()
  const [shelter, setShelter] = useState(ALL_SHELTERS)
  const [sort, setSort] = useState<DonorSort>('newest')

  // The filters end up in a query key, so they have to be a stable reference.
  const filters = useMemo<DonorFilters>(
    () => ({ shelter: toShelterFilter(shelter), sort }),
    [shelter, sort],
  )

  const shelters = useShelters()
  const {
    data,
    isPending,
    isError,
    isPlaceholderData,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useDonors(filters)

  const shelterNames = useMemo(
    () => new Map((shelters.data ?? []).map(({ id, name }) => [id, name])),
    [shelters.data],
  )

  const donors = data?.pages.flatMap((page) => page.donors) ?? []
  const total = data?.pages[0].total ?? 0

  return (
    <section aria-labelledby={HEADING_ID} className="flex flex-col gap-6">
      <h2 id={HEADING_ID} className="text-lg font-semibold text-gray-900">
        {t('donors.listHeading')}
      </h2>

      <DonorToolbar
        shelter={shelter}
        onShelterChange={setShelter}
        sort={sort}
        onSortChange={setSort}
      />

      {isPending ? (
        <ul aria-busy aria-label={t('donors.loading')}>
          {Array.from({ length: SKELETON_ROWS }, (_, index) => (
            <DonorRowSkeleton key={index} />
          ))}
        </ul>
      ) : isError ? (
        <p role="alert" className="text-sm text-red-700">
          {t('donors.error')}
        </p>
      ) : total === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-gray-200 p-10 text-center">
          <p className="text-gray-600">{t('donors.empty')}</p>
          <Button variant="secondary" onClick={() => setShelter(ALL_SHELTERS)}>
            {t('donors.clearFilter')}
          </Button>
        </div>
      ) : (
        <>
          <p aria-live="polite" className="text-xs text-gray-500">
            {t('donors.shown', { shown: donors.length, total })}
          </p>

          <ul
            aria-busy={isPlaceholderData || undefined}
            className={isPlaceholderData ? 'opacity-60 transition-opacity' : undefined}
          >
            {donors.map((donor, index) => (
              <DonorRow
                key={donor.id}
                donor={donor}
                shelterName={donor.shelterId ? shelterNames.get(donor.shelterId) : undefined}
                index={index % DONORS_PAGE_SIZE}
              />
            ))}
            {isFetchingNextPage &&
              Array.from({ length: 3 }, (_, index) => <DonorRowSkeleton key={`more-${index}`} />)}
          </ul>

          {hasNextPage && (
            <Button
              variant="secondary"
              className="self-center"
              disabled={isFetchingNextPage || isPlaceholderData}
              onClick={() => fetchNextPage()}
            >
              {isFetchingNextPage ? t('donors.loadingMore') : t('donors.loadMore')}
            </Button>
          )}
        </>
      )}
    </section>
  )
}
