import { pageMetadata } from '@/seo'

import { ContactContent } from './ContactContent'

export const metadata = pageMetadata({
  path: '/kontakt',
  titleKey: 'meta.contactTitle',
  descriptionKey: 'meta.contactDescription',
})

export default function ContactPage() {
  return <ContactContent />
}
