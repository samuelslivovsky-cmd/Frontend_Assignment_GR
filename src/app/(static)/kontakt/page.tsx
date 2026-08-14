import type { Metadata } from 'next'
import Image from 'next/image'

import { Mail, MapPin, Phone } from '@/components/icons'
import { BackLink } from '@/components/layout/BackLink'

export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Napíšte nám, zavolajte alebo sa zastavte v našej kancelárii v Žiline.',
}

const CONTACT_CARDS = [
  {
    Icon: Mail,
    title: 'Email',
    note: 'Our friendly team is here to help.',
    value: 'hello@goodrequest.com',
    href: 'mailto:hello@goodrequest.com',
  },
  {
    Icon: MapPin,
    title: 'Office',
    note: 'Come say hello at our office HQ.',
    value: 'Obchodná 3D, 010 08 Žilina, Slovakia',
    href: 'https://maps.google.com/?q=Obchodn%C3%A1+3D,+010+08+%C5%BDilina',
  },
  {
    Icon: Phone,
    title: 'Phone',
    note: 'Mon-Fri from 8am to 5pm.',
    value: '+421 911 750 750',
    href: 'tel:+421911750750',
  },
]

export default function ContactPage() {
  return (
    <div className="flex flex-col gap-12">
      <BackLink />
      <h1 className="text-6xl leading-[1.15] font-bold tracking-tight text-gray-900">Kontakt</h1>

      <div className="grid gap-10 sm:grid-cols-3">
        {CONTACT_CARDS.map(({ Icon, title, note, value, href }) => (
          <div key={title} className="flex flex-col items-center gap-2 text-center">
            <span className="mb-2 flex size-12 items-center justify-center rounded-[10px] bg-indigo-100 text-indigo-600">
              <Icon width={24} height={24} />
            </span>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <p className="text-gray-600">{note}</p>
            <a href={href} className="font-medium text-indigo-600 hover:text-indigo-700">
              {value}
            </a>
          </div>
        ))}
      </div>

      <div className="relative aspect-[1120/376] w-full">
        <Image
          src="/images/dog-contact.png"
          alt=""
          fill
          sizes="(min-width: 1200px) 1120px, 100vw"
          className="rounded-2xl object-cover"
        />
      </div>
    </div>
  )
}
