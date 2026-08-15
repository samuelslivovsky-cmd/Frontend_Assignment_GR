import { pageMetadata } from '@/seo'

import { DonorsContent } from './DonorsContent'

export const metadata = pageMetadata({
  path: '/darcovia',
  titleKey: 'meta.donorsTitle',
  descriptionKey: 'meta.donorsDescription',
})

export default function DonorsPage() {
  return <DonorsContent />
}
