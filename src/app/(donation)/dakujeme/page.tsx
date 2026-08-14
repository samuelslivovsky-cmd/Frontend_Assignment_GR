import type { Metadata } from 'next'

import { ThankYou } from '@/features/donation/ThankYou'
import { serverT } from '@/i18n/server'

export const metadata: Metadata = {
  title: serverT('meta.thanksTitle'),
  description: serverT('meta.thanksDescription'),
}

export default function ThankYouPage() {
  return <ThankYou />
}
