'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  getContributionResults,
  getShelters,
  postContribution,
} from '@/lib/api/shelters'

export const shelterKeys = {
  all: ['shelters'] as const,
  list: () => [...shelterKeys.all, 'list'] as const,
  results: () => [...shelterKeys.all, 'results'] as const,
}

export function useShelters() {
  return useQuery({
    queryKey: shelterKeys.list(),
    queryFn: getShelters,
  })
}

export function useContributionResults() {
  return useQuery({
    queryKey: shelterKeys.results(),
    queryFn: getContributionResults,
    refetchInterval: 60_000,
  })
}

export function useContribute() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postContribution,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: shelterKeys.results() }),
  })
}
