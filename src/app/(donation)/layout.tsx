import Image from 'next/image'
import type { ReactNode } from 'react'

import { Footer } from '@/components/layout/Footer'
import { Stepper } from '@/features/donation/Stepper'

export default function DonationLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] gap-10 p-6 lg:p-10">
      <div className="flex min-h-[calc(100vh-3rem)] flex-1 justify-center lg:min-h-[calc(100vh-5rem)]">
        <div className="flex w-full max-w-[600px] flex-col gap-10">
          <Stepper />
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </div>

      {/* Decorative — the form carries all the meaning, so it stays out of the accessibility tree. */}
      <div className="relative hidden w-[602px] shrink-0 lg:block">
        <Image
          src="/images/dog-form.png"
          alt=""
          fill
          priority
          sizes="602px"
          className="rounded-2xl object-cover"
        />
      </div>
    </div>
  )
}
