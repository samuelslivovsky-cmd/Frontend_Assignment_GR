import { RequireDraft } from '@/features/donation/RequireDraft'
import { ConfirmationStep } from '@/features/donation/steps/ConfirmationStep'
import { pageMetadata } from '@/seo'

export const metadata = pageMetadata({
  path: '/potvrdenie',
  titleKey: 'meta.confirmationStepTitle',
  descriptionKey: 'meta.confirmationStepDescription',
})

export default function ConfirmationStepPage() {
  return (
    <RequireDraft upTo="personal">
      <ConfirmationStep />
    </RequireDraft>
  )
}
