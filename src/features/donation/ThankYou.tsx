'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { Check } from '@/components/icons'

import { DonationDog } from './DonationDog'
import { useDonationStore } from './store'

export function ThankYou() {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const completed = useDonationStore((state) => state.completed)
  const clearDraft = useDonationStore((state) => state.clearDraft)

  useEffect(() => {
    // Reached without finishing the wizard — nothing to thank anyone for.
    if (!completed) {
      router.replace('/')
      return
    }
    clearDraft()
  }, [completed, clearDraft, router])

  if (!completed) return null

  const amount = new Intl.NumberFormat(i18n.language, {
    style: 'currency',
    currency: 'EUR',
  }).format(completed.amount)

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
      {/* The dog matches what was actually donated, so a bigger gift gets a bigger grin. */}
      <div className="relative">
        <DonationDog amount={completed.amount} size="lg" />
        <span className="absolute right-1 bottom-1 flex size-9 items-center justify-center rounded-full bg-indigo-600 text-white">
          <Check width={20} height={20} />
        </span>
      </div>

      <h1 className="text-5xl leading-[1.15] font-bold tracking-tight text-gray-900">
        {t('thanks.heading')}
      </h1>

      <p className="max-w-md text-gray-600">{t('thanks.body', { amount })}</p>

      {completed.message && <p className="text-sm text-gray-500">{completed.message}</p>}

      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700"
        >
          {t('thanks.donateAgain')}
        </Link>
        <Link
          href="/o-projekte"
          className="rounded-lg bg-gray-100 px-5 py-3 text-sm font-medium text-gray-900 hover:bg-gray-200"
        >
          {t('thanks.seeResults')}
        </Link>
      </div>
    </div>
  )
}
