import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { Notifications } from '@/components/Notifications'
import { DEFAULT_LOCALE } from '@/i18n/config'
import { serverT } from '@/i18n/server'
import { SITE_URL } from '@/seo'

import './globals.css'
import { Providers } from './providers'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'latin-ext'],
})

export const metadata: Metadata = {
  // Without a base, Next cannot turn the generated og:image into an absolute URL.
  metadataBase: new URL(SITE_URL),
  title: {
    default: serverT('meta.siteName'),
    template: `%s | ${serverT('meta.siteName')}`,
  },
  description: serverT('meta.siteDescription'),
  openGraph: {
    type: 'website',
    siteName: serverT('meta.siteName'),
    locale: 'sk_SK',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang={DEFAULT_LOCALE} className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-gray-900">
        <Providers>
          <SkipLink />
          {children}
          <Notifications />
        </Providers>
      </body>
    </html>
  )
}

function SkipLink() {
  return (
    <a
      href="#obsah"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-indigo-600 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
    >
      {serverT('common.skipToContent')}
    </a>
  )
}
