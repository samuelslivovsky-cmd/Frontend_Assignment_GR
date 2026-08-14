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

export async function getShelters(): Promise<Shelter[]> {
  const { shelters } = await apiFetch<{ shelters?: Shelter[] }>('/api/v1/shelters/')

  return shelters ?? []
}

export function getContributionResults(): Promise<ContributionResults> {
  return apiFetch<ContributionResults>('/api/v1/shelters/results')
}

export function postContribution(payload: ContributionPayload): Promise<{ messages: ApiMessage[] }> {
  return apiFetch('/api/v1/shelters/contribute', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
