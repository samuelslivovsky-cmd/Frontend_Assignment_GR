import { apiFetch, type ApiMessage } from './client'

export type Shelter = {
  id: number
  name: string
}

export type ContributionResults = {
  contributors: number
  contribution: number | null
}

export type Contributor = {
  firstName: string
  lastName: string
  email: string
  phone?: string | null
}

export type ContributionPayload = {
  contributors: Contributor[]
  shelterID?: number | null
  value: number
}

/**
 * TEMPORARY: the app runs on canned data so development does not depend on the
 * live API — and so test submissions stop inflating the public donation counter.
 * Set this to false to talk to the real endpoints again; the calls below are
 * untouched and still type-checked.
 */
const USE_PLACEHOLDER_DATA: boolean = true

const PLACEHOLDER_SHELTERS: Shelter[] = [
  { id: 1, name: 'Žilinský útulok o.z.' },
  { id: 2, name: 'Trenčiansky Útulok' },
  { id: 3, name: 'HAFKÁČI' },
  { id: 4, name: 'Útulok pre psov - TEZAS' },
  { id: 5, name: 'Útulok Piešťany' },
  { id: 6, name: 'Sloboda zvierat' },
  { id: 7, name: 'Útulok Nádej' },
  { id: 8, name: 'OZ Tuláčik Brezno' },
  { id: 9, name: 'Mestský Útulok - Martin' },
  { id: 10, name: 'Šťastný Domov - Happy House' },
  { id: 11, name: 'OZ Pes v núdzi' },
  { id: 12, name: 'Cerberus' },
  { id: 13, name: 'Útulok Levice - OZ Šťastný Domov' },
  { id: 14, name: 'Mestský útulok Nové Zámky' },
  { id: 15, name: 'Únia vzájomnej pomoci ľudí a psov' },
  { id: 16, name: 'OZ OČAMI PSA' },
]

// Matches the numbers used in the Figma design.
const PLACEHOLDER_RESULTS: ContributionResults = { contributors: 1028, contribution: 12200 }

const PLACEHOLDER_CONFIRMATION: { messages: ApiMessage[] } = {
  messages: [{ type: 'SUCCESS', message: 'Príspevok bol úspešne zaznamenaný' }],
}

/**
 * Keeps loading and pending states visible while the API is stubbed out —
 * without it the skeletons would never render and could rot unnoticed.
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getShelters(): Promise<Shelter[]> {
  if (USE_PLACEHOLDER_DATA) {
    await delay(1200)
    return PLACEHOLDER_SHELTERS
  }

  const { shelters } = await apiFetch<{ shelters?: Shelter[] }>('/api/v1/shelters/')

  return shelters ?? []
}

export async function getContributionResults(): Promise<ContributionResults> {
  if (USE_PLACEHOLDER_DATA) {
    await delay(1200)
    return PLACEHOLDER_RESULTS
  }

  return apiFetch<ContributionResults>('/api/v1/shelters/results')
}

export async function postContribution(
  payload: ContributionPayload,
): Promise<{ messages: ApiMessage[] }> {
  if (USE_PLACEHOLDER_DATA) {
    await delay(600)
    return PLACEHOLDER_CONFIRMATION
  }

  return apiFetch('/api/v1/shelters/contribute', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
