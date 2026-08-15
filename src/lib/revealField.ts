export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function reveal(element: Element, block: ScrollLogicalPosition = 'nearest') {
  element.scrollIntoView({
    block,
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
  })
}

export function revealCard(card: HTMLElement) {
  const box = card.closest('[data-scroll-area]')

  if (!(box instanceof HTMLElement) || box.scrollHeight <= box.clientHeight) {
    reveal(card, 'nearest')
    return
  }

  box.scrollTo({
    top: card.offsetTop,
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
  })
}

export function revealField(fieldId: string) {
  const field = document.getElementById(fieldId)
  if (!field) return

  const collapsed = field.closest('[data-donor-card]')?.querySelector('button[aria-expanded=false]')
  if (collapsed instanceof HTMLElement) collapsed.click()

  requestAnimationFrame(() => {
    field.focus({ preventScroll: true })
    reveal(field, 'center')
  })
}
