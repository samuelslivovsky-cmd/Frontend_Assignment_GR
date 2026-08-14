'use client'

import { useRouter } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'

import { useDonationStore } from './store'

type RequireDraftProps = {
  upTo: 'shelter' | 'personal'
  children: ReactNode
}

// The draft lives in memory only, so a direct hit on a later step has nothing to show.
export function RequireDraft({ upTo, children }: RequireDraftProps) {
  const router = useRouter()
  const shelter = useDonationStore((state) => state.shelter)
  const personal = useDonationStore((state) => state.personal)
  const isReady = upTo === 'shelter' ? Boolean(shelter) : Boolean(shelter && personal)

  useEffect(() => {
    if (!isReady) router.replace('/')
  }, [isReady, router])

  return isReady ? children : null
}
