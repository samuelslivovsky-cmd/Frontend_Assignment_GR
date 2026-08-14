import type { Metadata } from 'next'

import { serverT } from '@/i18n/server'

import { ContactContent } from './ContactContent'

export const metadata: Metadata = {
  title: serverT('meta.contactTitle'),
  description: serverT('meta.contactDescription'),
}

export default function ContactPage() {
  return <ContactContent />
}
