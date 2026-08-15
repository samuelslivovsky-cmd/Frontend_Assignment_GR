'use client'

import { useTranslation } from 'react-i18next'

import { BackLink } from '@/components/layout/BackLink'
import { ContributionResults } from '@/features/donation/ContributionResults'
import { DonorList } from '@/features/donors/DonorList'

export function DonorsContent() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-12">
      <BackLink />
      <h1 className="text-4xl leading-[1.15] font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
        {t('donors.heading')}
      </h1>

      <p className="text-gray-700">{t('donors.intro')}</p>

      <div className="border-y border-gray-200 py-14">
        <ContributionResults />
      </div>

      <DonorList />

      <p className="text-xs text-gray-500">{t('donors.disclaimer')}</p>
    </div>
  )
}
