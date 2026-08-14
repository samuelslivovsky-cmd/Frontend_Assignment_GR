import type { Metadata } from 'next'

import { RequireDraft } from '@/features/donation/RequireDraft'
import { ConfirmationStep } from '@/features/donation/steps/ConfirmationStep'

export const metadata: Metadata = {
  title: 'Potvrdenie',
  description: 'Skontrolujte zadané údaje a odošlite svoj príspevok nadácii GoodBoy.',
}

export default function ConfirmationStepPage() {
  return (
    <RequireDraft upTo="personal">
      <ConfirmationStep />
    </RequireDraft>
  )
}
