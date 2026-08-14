import { ThankYou } from '@/features/donation/ThankYou'
import { pageMetadata } from '@/seo'

export const metadata = pageMetadata({
  path: '/dakujeme',
  titleKey: 'meta.thanksTitle',
  descriptionKey: 'meta.thanksDescription',
})

export default function ThankYouPage() {
  return <ThankYou />
}
