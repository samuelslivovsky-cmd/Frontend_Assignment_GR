import Image from 'next/image'
import Link from 'next/link'

import { Facebook, Instagram } from '@/components/icons'

const LINKS = [
  { href: '/kontakt', label: 'Kontakt' },
  { href: '/o-projekte', label: 'O projekte' },
]

const SOCIALS = [
  { href: 'https://facebook.com', label: 'Facebook', Icon: Facebook },
  { href: 'https://instagram.com', label: 'Instagram', Icon: Instagram },
]

export function Footer() {
  return (
    <footer className="flex items-center justify-between gap-6 border-t border-gray-200 py-6">
      <Link href="/" aria-label="Good boy — domov">
        <Image src="/images/logo.svg" alt="Good boy" width={124} height={32} priority />
      </Link>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-gray-500">
          {SOCIALS.map(({ href, label, Icon }) => (
            <a key={label} href={href} aria-label={label} className="hover:text-gray-900">
              <Icon />
            </a>
          ))}
        </div>
        <nav className="flex gap-6 text-sm text-gray-700">
          {LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className="hover:text-gray-900">
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
