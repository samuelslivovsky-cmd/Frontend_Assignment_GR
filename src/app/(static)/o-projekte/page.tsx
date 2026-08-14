import type { Metadata } from 'next'

import { serverT } from '@/i18n/server'

import { AboutContent } from './AboutContent'

export const metadata: Metadata = {
  title: serverT('meta.aboutTitle'),
  description: serverT('meta.aboutDescription'),
}

export default function AboutPage() {
  return <AboutContent />
}
