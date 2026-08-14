export const DONATION_STEPS = [
  { href: '/', label: 'Výber útulku' },
  { href: '/osobne-udaje', label: 'Osobné údaje' },
  { href: '/potvrdenie', label: 'Potvrdenie' },
] as const

export type DonationStepHref = (typeof DONATION_STEPS)[number]['href']

export function stepIndex(href: string): number {
  return DONATION_STEPS.findIndex((step) => step.href === href)
}
