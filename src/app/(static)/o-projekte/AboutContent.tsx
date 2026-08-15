'use client'

import { useTranslation } from 'react-i18next'

import Link from 'next/link'

import { ArrowRight } from '@/components/icons'
import { BackLink } from '@/components/layout/BackLink'
import { ContributionResults } from '@/features/donation/ContributionResults'

export function AboutContent() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-12">
      <BackLink />
      <h1 className="text-4xl leading-[1.15] font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
        {t('about.heading')}
      </h1>

      <p className="text-gray-700">{t('about.paragraph1')}</p>

      <div className="flex flex-col items-center gap-10 border-y border-gray-200 py-14">
        <ContributionResults />

        <Link
          href="/darcovia"
          className="group flex w-fit items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          {t('about.seeDonors')}
          <ArrowRight className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <p className="text-gray-700">{t('about.paragraph2')}</p>
    </div>
  )
}
