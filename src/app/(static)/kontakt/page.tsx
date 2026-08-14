import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Napíšte nám, zavolajte alebo sa zastavte v našej kancelárii v Žiline.',
}

const CONTACT_CARDS = [
  {
    title: 'Email',
    note: 'Our friendly team is here to help.',
    value: 'hello@goodrequest.com',
    href: 'mailto:hello@goodrequest.com',
  },
  {
    title: 'Office',
    note: 'Come say hello at our office HQ.',
    value: 'Obchodná 3D, 010 08 Žilina, Slovakia',
    href: 'https://maps.google.com/?q=Obchodná+3D,+010+08+Žilina',
  },
  {
    title: 'Phone',
    note: 'Mon-Fri from 8am to 5pm.',
    value: '+421 911 750 750',
    href: 'tel:+421911750750',
  },
]

export default function ContactPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-10">
      <Link href="/" className="text-sm text-indigo-600 hover:underline">
        ← Späť
      </Link>
      <h1 className="text-5xl font-bold tracking-tight">Kontakt</h1>
      <div className="grid gap-8 sm:grid-cols-3">
        {CONTACT_CARDS.map(({ title, note, value, href }) => (
          <div key={title} className="flex flex-col items-center gap-2 text-center">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm text-gray-600">{note}</p>
            <a href={href} className="text-sm text-indigo-600 hover:underline">
              {value}
            </a>
          </div>
        ))}
      </div>
    </main>
  )
}
