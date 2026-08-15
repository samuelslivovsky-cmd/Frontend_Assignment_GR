import { buildPlaceholderDonors } from './donors.mock'

export type Donor = {
  id: string
  firstName: string
  lastName: string
  amount: number
  /** `null` marks a general contribution to the foundation. */
  shelterId: number | null
  donatedAt: string
}

export const DONOR_SORTS = ['newest', 'amount'] as const

export type DonorSort = (typeof DONOR_SORTS)[number]

export type DonorFilters = {
  /** `null` is every donor; `'FOUNDATION'` narrows to contributions with no shelter. */
  shelter: number | 'FOUNDATION' | null
  sort: DonorSort
}

export type DonorPage = {
  donors: Donor[]
  nextPage: number | null
  total: number
}

export const DONORS_PAGE_SIZE = 8

const FIRST_PAGE_DELAY_MS = 1200
const NEXT_PAGE_DELAY_MS = 600

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

let donors: Donor[] | null = null

const allDonors = () => (donors ??= buildPlaceholderDonors())

const matchesShelter = (donor: Donor, shelter: DonorFilters['shelter']) => {
  if (shelter === null) return true
  if (shelter === 'FOUNDATION') return donor.shelterId === null
  return donor.shelterId === shelter
}

const byNewest = (a: Donor, b: Donor) => b.donatedAt.localeCompare(a.donatedAt)

// Ties broken by date so a page boundary never splits equal amounts unpredictably.
const byAmount = (a: Donor, b: Donor) => b.amount - a.amount || byNewest(a, b)

/**
 * The list has no endpoint behind it — `/shelters/results` returns a donor count and
 * nothing else. This body is the seam: with a real endpoint it becomes a single
 * `apiFetch<DonorPage>('/api/v1/shelters/donors?' + params)`, which is why the query
 * string is built here even though nothing sends it yet.
 */
export async function getDonors({
  page,
  shelter,
  sort,
}: DonorFilters & { page: number }): Promise<DonorPage> {
  const params = new URLSearchParams({ page: String(page), limit: String(DONORS_PAGE_SIZE), sort })
  if (shelter !== null) params.set('shelter', String(shelter))

  await delay(page === 0 ? FIRST_PAGE_DELAY_MS : NEXT_PAGE_DELAY_MS)

  const matching = allDonors()
    .filter((donor) => matchesShelter(donor, shelter))
    .sort(sort === 'amount' ? byAmount : byNewest)

  const start = page * DONORS_PAGE_SIZE
  const end = start + DONORS_PAGE_SIZE

  return {
    donors: matching.slice(start, end),
    nextPage: end < matching.length ? page + 1 : null,
    total: matching.length,
  }
}
