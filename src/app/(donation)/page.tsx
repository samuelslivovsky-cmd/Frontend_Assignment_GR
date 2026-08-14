import type { Metadata } from 'next'

import { serverT } from '@/i18n/server'

import { ShelterStep } from '@/features/donation/steps/ShelterStep'

export const metadata: Metadata = {
  title: serverT('meta.shelterStepTitle'),
  description: serverT('meta.shelterStepDescription'),
}

export default function ShelterStepPage() {
  return <ShelterStep />
}
