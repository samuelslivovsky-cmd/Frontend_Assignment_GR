import type { ReactNode } from 'react'

import { DogPhoto } from '@/components/DogPhoto'
import { Footer } from '@/components/layout/Footer'
import { Stepper } from '@/features/donation/Stepper'

export default function DonationLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] gap-10 p-4 sm:p-6 lg:p-10">
      {/* `dvh` rather than `vh` so the iOS address bar cannot push the footer off screen.
          From `lg` the height is definite rather than a floor. That is what lets every
          step lay itself out as fixed heading, scrolling body, fixed actions — the body
          absorbs the leftover space instead of the page growing under it. */}
      <div className="flex min-h-[calc(100dvh-2rem)] flex-1 justify-center sm:min-h-[calc(100dvh-3rem)] lg:h-[calc(100dvh-5rem)] lg:min-h-[calc(100dvh-5rem)]">
        <div className="flex w-full max-w-[600px] flex-col gap-8 sm:gap-10 lg:min-h-0">
          <Stepper />
          <main id="obsah" className="flex flex-1 flex-col lg:min-h-0">
            {children}
          </main>
          <Footer />
        </div>
      </div>

      <DogPhoto />
    </div>
  )
}
