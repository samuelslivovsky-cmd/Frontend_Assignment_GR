import type { Metadata } from 'next'

import { RequireDraft } from '@/features/donation/RequireDraft'
import { PersonalStep } from '@/features/donation/steps/PersonalStep'

export const metadata: Metadata = {
  title: 'Osobné údaje',
  description: 'Zadajte svoje kontaktné údaje, aby sme vedeli, kto za príspevkom stojí.',
}

export default function PersonalStepPage() {
  return (
    <RequireDraft upTo="shelter">
      <PersonalStep />
    </RequireDraft>
  )
}
