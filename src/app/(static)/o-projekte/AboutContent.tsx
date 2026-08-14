'use client'

import { useTranslation } from 'react-i18next'

import { BackLink } from '@/components/layout/BackLink'
import { ContributionResults } from '@/features/donation/ContributionResults'

export function AboutContent() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-12">
      <BackLink />
      <h1 className="text-6xl leading-[1.15] font-bold tracking-tight text-gray-900">
        {t('about.heading')}
      </h1>

      <p className="text-gray-700">{t('about.paragraph1')}</p>

      <div className="border-y border-gray-200 py-14">
        <ContributionResults />
      </div>

      <p className="text-gray-700">{t('about.paragraph2')}</p>
    </div>
  )
}
