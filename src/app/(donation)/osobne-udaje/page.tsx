import { RequireDraft } from '@/features/donation/RequireDraft'
import { PersonalStep } from '@/features/donation/steps/PersonalStep'
import { pageMetadata } from '@/seo'

export const metadata = pageMetadata({
  path: '/osobne-udaje',
  titleKey: 'meta.personalStepTitle',
  descriptionKey: 'meta.personalStepDescription',
})

export default function PersonalStepPage() {
  return (
    <RequireDraft upTo="shelter">
      <PersonalStep />
    </RequireDraft>
  )
}
