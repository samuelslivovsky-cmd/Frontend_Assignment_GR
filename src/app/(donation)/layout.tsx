import type { ReactNode } from 'react'

import { Stepper } from '@/features/donation/Stepper'

export default function DonationLayout({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-10 px-4 py-10">
      <Stepper />
      {children}
    </main>
  )
}
