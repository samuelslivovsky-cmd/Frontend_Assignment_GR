'use client'

import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'

import { getDonors, type DonorFilters } from '@/api/donors'

export const donorKeys = {
  all: ['donors'] as const,
  list: (filters: DonorFilters) => [...donorKeys.all, 'list', filters] as const,
}

/**
 * The filters live in the key, so changing one starts a fresh query — paging resets
 * itself and going back to a previous filter comes straight from the cache.
 */
export function useDonors(filters: DonorFilters) {
  return useInfiniteQuery({
    queryKey: donorKeys.list(filters),
    queryFn: ({ pageParam }) => getDonors({ ...filters, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    // Without this every filter change would flash the skeletons back in.
    placeholderData: keepPreviousData,
  })
}
