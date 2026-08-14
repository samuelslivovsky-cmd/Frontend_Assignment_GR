import type { Metadata } from 'next'

import { RequireDraft } from '@/features/donation/RequireDraft'
import { PersonalStep } from '@/features/donation/steps/PersonalStep'
import { serverT } from '@/i18n/server'

export const metadata: Metadata = {
  title: serverT('meta.personalStepTitle'),
  description: serverT('meta.personalStepDescription'),
}

export default function PersonalStepPage() {
  return (
    <RequireDraft upTo="shelter">
      <PersonalStep />
    </RequireDraft>
  )
}
