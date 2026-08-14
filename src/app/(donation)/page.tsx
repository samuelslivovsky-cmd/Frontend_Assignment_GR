import { ShelterStep } from '@/features/donation/steps/ShelterStep'
import { pageMetadata } from '@/seo'

export const metadata = pageMetadata({
  path: '/',
  titleKey: 'meta.shelterStepTitle',
  descriptionKey: 'meta.shelterStepDescription',
})

export default function ShelterStepPage() {
  return <ShelterStep />
}
