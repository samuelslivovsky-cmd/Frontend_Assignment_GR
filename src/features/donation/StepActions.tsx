import Link from 'next/link'

import { Button } from '@/components/form/inputs'
import { ArrowLeft, ArrowRight } from '@/components/icons'

type StepActionsProps = {
  backHref?: string
  submitLabel: string
  withArrow?: boolean
  isSubmitting?: boolean
}

export function StepActions({ backHref, submitLabel, withArrow, isSubmitting }: StepActionsProps) {
  return (
    <div className="mt-auto flex items-center justify-between gap-4 pt-8">
      {backHref ? (
        <Link
          href={backHref}
          className="flex items-center gap-2 rounded-lg bg-gray-100 px-5 py-3 text-sm font-medium text-gray-900 hover:bg-gray-200"
        >
          <ArrowLeft />
          Späť
        </Link>
      ) : (
        <span />
      )}
      <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-5 py-3">
        {isSubmitting ? 'Odosielam…' : submitLabel}
        {withArrow && !isSubmitting && <ArrowRight />}
      </Button>
    </div>
  )
}
