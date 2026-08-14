import Link from 'next/link'

import { ArrowLeft } from '@/components/icons'

export function BackLink({ href = '/' }: { href?: string }) {
  return (
    <Link
      href={href}
      className="flex w-fit items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
    >
      <ArrowLeft />
      Späť
    </Link>
  )
}
