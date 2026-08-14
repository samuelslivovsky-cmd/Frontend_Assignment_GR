export const DONATION_STEPS = [
  { href: '/', labelKey: 'steps.shelter' },
  { href: '/osobne-udaje', labelKey: 'steps.personal' },
  { href: '/potvrdenie', labelKey: 'steps.confirmation' },
] as const

export function stepIndex(href: string): number {
  return DONATION_STEPS.findIndex((step) => step.href === href)
}
