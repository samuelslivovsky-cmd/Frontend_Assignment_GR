'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import { FieldLegend } from '@/components/form/FieldMark'
import { Button } from '@/components/form/inputs'
import { ArrowLeft, ArrowRight } from '@/components/icons'

type StepActionsProps = {
  backHref?: string
  submitLabel: string
  withArrow?: boolean
  isSubmitting?: boolean
}

export function StepActions({ backHref, submitLabel, withArrow, isSubmitting }: StepActionsProps) {
  const { t } = useTranslation()

  return (
    <div className="mt-auto flex flex-col gap-5 pt-8">
      <FieldLegend />

      <div className="flex items-center justify-between gap-4">
        {backHref ? (
          <Link
            href={backHref}
            className="flex items-center gap-2 rounded-lg bg-gray-100 px-5 py-3 text-sm font-medium text-gray-900 hover:bg-gray-200"
          >
            <ArrowLeft />
            {t('common.back')}
          </Link>
        ) : (
          <span />
        )}
        <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-5 py-3">
          {isSubmitting ? t('confirmationStep.submitting') : submitLabel}
          {withArrow && !isSubmitting && <ArrowRight />}
        </Button>
      </div>
    </div>
  )
}
