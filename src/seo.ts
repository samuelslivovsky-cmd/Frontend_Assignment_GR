import type { Metadata } from 'next'

import { serverT } from '@/i18n/server'

/** Absolute origin the crawler sees. Without it `og:image` would resolve to localhost. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

/** Routes that stand on their own when a visitor lands on them straight from search. */
export const PUBLIC_ROUTES = ['/', '/kontakt', '/o-projekte', '/darcovia'] as const

/** The rest of the wizard: without a draft in memory these bounce back to `/`. */
export const PRIVATE_ROUTES = ['/osobne-udaje', '/potvrdenie', '/dakujeme'] as const

type Route = (typeof PUBLIC_ROUTES)[number] | (typeof PRIVATE_ROUTES)[number]

export const absoluteUrl = (path: string) => new URL(path, SITE_URL).toString()

type PageMetadata = {
  path: Route
  titleKey: string
  descriptionKey: string
}

/**
 * Indexability follows from the route lists above rather than a per-page flag, so
 * a new step cannot be added to the wizard and quietly left open to crawlers.
 */
export function pageMetadata({ path, titleKey, descriptionKey }: PageMetadata): Metadata {
  const isPublic = (PUBLIC_ROUTES as readonly string[]).includes(path)

  return {
    title: serverT(titleKey),
    description: serverT(descriptionKey),
    alternates: { canonical: path },
    // Links are still worth following — only the page itself is not worth listing.
    ...(isPublic ? {} : { robots: { index: false, follow: true } }),
  }
}
