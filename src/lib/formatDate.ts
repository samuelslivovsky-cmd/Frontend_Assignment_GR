const DAY_MS = 24 * 60 * 60 * 1000
const RELATIVE_DAYS = 7

/**
 * Recent donations read better as "yesterday" than as a date, and `numeric: 'auto'`
 * gives that wording — plus the Slovak plural forms — without any translated strings.
 */
export function formatDonationDate(iso: string, locale: string) {
  const date = new Date(iso)
  const days = Math.round((date.getTime() - Date.now()) / DAY_MS)

  if (Math.abs(days) < RELATIVE_DAYS) {
    return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(days, 'day')
  }

  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}
