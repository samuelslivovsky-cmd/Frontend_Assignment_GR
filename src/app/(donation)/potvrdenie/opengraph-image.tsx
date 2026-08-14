import { ogCard, contentType, size } from '@/og/card'
import { serverT } from '@/i18n/server'

export { contentType, size }
export const alt = serverT('meta.confirmationStepTitle')

export default function OpengraphImage() {
  return ogCard(serverT('meta.confirmationStepTitle'), serverT('meta.confirmationStepDescription'))
}