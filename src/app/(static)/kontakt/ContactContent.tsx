'use client'

import Image from 'next/image'
import { useTranslation } from 'react-i18next'

import { Mail, MapPin, Phone } from '@/components/icons'
import { BackLink } from '@/components/layout/BackLink'

const CONTACT_CARDS = [
  {
    Icon: Mail,
    titleKey: 'contact.emailTitle',
    noteKey: 'contact.emailNote',
    value: 'hello@goodrequest.com',
    href: 'mailto:hello@goodrequest.com',
  },
  {
    Icon: MapPin,
    titleKey: 'contact.officeTitle',
    noteKey: 'contact.officeNote',
    value: 'Obchodná 3D, 010 08 Žilina, Slovakia',
    href: 'https://maps.google.com/?q=Obchodn%C3%A1+3D,+010+08+%C5%BDilina',
  },
  {
    Icon: Phone,
    titleKey: 'contact.phoneTitle',
    noteKey: 'contact.phoneNote',
    value: '+421 911 750 750',
    href: 'tel:+421911750750',
  },
]

export function ContactContent() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-12">
      <BackLink />
      <h1 className="text-4xl leading-[1.15] font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
        {t('contact.heading')}
      </h1>

      <div className="grid gap-10 sm:grid-cols-3">
        {CONTACT_CARDS.map(({ Icon, titleKey, noteKey, value, href }) => (
          <div key={titleKey} className="flex flex-col items-center gap-2 text-center">
            <span className="mb-2 flex size-12 items-center justify-center rounded-[10px] bg-indigo-100 text-indigo-600">
              <Icon width={24} height={24} />
            </span>
            <h2 className="text-lg font-semibold text-gray-900">{t(titleKey)}</h2>
            <p className="text-gray-600">{t(noteKey)}</p>
            <a href={href} className="font-medium text-indigo-600 hover:text-indigo-700">
              {value}
            </a>
          </div>
        ))}
      </div>

      <div className="relative aspect-1120/376 w-full">
        <Image
          src="/images/dog-contact.png"
          alt=""
          fill
          priority
          sizes="(min-width: 1200px) 1120px, 100vw"
          className="rounded-2xl object-cover"
        />
      </div>
    </div>
  )
}
