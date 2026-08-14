import Link from 'next/link'

const FOOTER_LINKS = [
  { href: '/kontakt', label: 'Kontakt' },
  { href: '/o-projekte', label: 'O projekte' },
]

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-6">
        <Link href="/" className="font-semibold">
          Good boy
        </Link>
        <nav className="flex gap-6 text-sm text-gray-700">
          {FOOTER_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className="hover:text-gray-900">
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
