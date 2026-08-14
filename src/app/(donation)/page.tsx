import type { Metadata } from 'next'

import { ShelterStep } from '@/features/donation/steps/ShelterStep'

export const metadata: Metadata = {
  title: 'Výber útulku',
  description: 'Vyberte si, komu chcete prispieť a akou sumou podporíte psíkov v útulkoch.',
}

export default function ShelterStepPage() {
  return <ShelterStep />
}
