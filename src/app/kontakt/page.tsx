import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Kontaktné údaje nadácie GoodBoy.',
}

// TODO: replace with the real contact details from the Figma design.
const CONTACT_ROWS = [
  { label: 'Nadácia', value: 'Nadácia GoodBoy' },
  { label: 'Adresa', value: 'Framborská 58, 010 01 Žilina' },
  { label: 'IČO', value: '00000000' },
  { label: 'E-mail', value: 'podpora@goodboy.sk', href: 'mailto:podpora@goodboy.sk' },
  { label: 'Telefón', value: '+421 900 000 000', href: 'tel:+421900000000' },
]

export default function ContactPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4 py-10">
      <h1 className="text-3xl font-semibold">Kontakt</h1>
      <dl className="flex flex-col gap-3">
        {CONTACT_ROWS.map(({ label, value, href }) => (
          <div key={label} className="flex gap-4">
            <dt className="w-28 shrink-0 text-slate-600">{label}</dt>
            <dd>
              {href ? (
                <a href={href} className="underline underline-offset-4">
                  {value}
                </a>
              ) : (
                value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </main>
  )
}
