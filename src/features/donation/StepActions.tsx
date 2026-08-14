import Link from 'next/link'

import { Button } from '@/components/form/inputs'

type StepActionsProps = {
  backHref?: string
  submitLabel: string
  isSubmitting?: boolean
}

export function StepActions({ backHref, submitLabel, isSubmitting }: StepActionsProps) {
  return (
    <div className="flex items-center justify-between gap-4 pt-4">
      {backHref ? (
        <Link
          href={backHref}
          className="rounded-lg bg-gray-100 px-4 py-2 text-sm hover:bg-gray-200"
        >
          ← Späť
        </Link>
      ) : (
        <span />
      )}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Odosielam…' : submitLabel}
      </Button>
    </div>
  )
}
