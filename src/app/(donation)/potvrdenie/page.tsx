import type { Metadata } from 'next'

import { RequireDraft } from '@/features/donation/RequireDraft'
import { ConfirmationStep } from '@/features/donation/steps/ConfirmationStep'
import { serverT } from '@/i18n/server'

export const metadata: Metadata = {
  title: serverT('meta.confirmationStepTitle'),
  description: serverT('meta.confirmationStepDescription'),
}

export default function ConfirmationStepPage() {
  return (
    <RequireDraft upTo="personal">
      <ConfirmationStep />
    </RequireDraft>
  )
}
