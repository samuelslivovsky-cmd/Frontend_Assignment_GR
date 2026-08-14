import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { Notifications } from '@/components/Notifications'

import './globals.css'
import { Providers } from './providers'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'latin-ext'],
})

export const metadata: Metadata = {
  title: {
    default: 'Nadácia Good Boy',
    template: '%s | Nadácia Good Boy',
  },
  description: 'Podporte slovenské útulky pre psov.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="sk" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-gray-900">
        <Providers>
          {children}
          <Notifications />
        </Providers>
      </body>
    </html>
  )
}
