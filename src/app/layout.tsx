import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Link from 'next/link'

import { Notifications } from '@/components/Notifications'

import './globals.css'
import { Providers } from './providers'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Nadácia GoodBoy',
    template: '%s | Nadácia GoodBoy',
  },
  description: 'Podporte slovenské útulky pre psov.',
}

const NAV_LINKS = [
  { href: '/', label: 'Prispieť' },
  { href: '/kontakt', label: 'Kontakt' },
]

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="sk"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>
          <header className="border-b border-slate-200">
            <nav className="mx-auto flex max-w-2xl gap-6 p-4">
              {NAV_LINKS.map(({ href, label }) => (
                <Link key={href} href={href} className="underline-offset-4 hover:underline">
                  {label}
                </Link>
              ))}
            </nav>
          </header>
          {children}
          <Notifications />
        </Providers>
      </body>
    </html>
  )
}
