import { pageMetadata } from '@/seo'

import { AboutContent } from './AboutContent'

export const metadata = pageMetadata({
  path: '/o-projekte',
  titleKey: 'meta.aboutTitle',
  descriptionKey: 'meta.aboutDescription',
})

export default function AboutPage() {
  return <AboutContent />
}
