import type { ReactNode } from 'react'

import { DogPhoto } from '@/components/DogPhoto'
import { Footer } from '@/components/layout/Footer'
import { Stepper } from '@/features/donation/Stepper'

export default function DonationLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] gap-10 p-6 lg:p-10">
      <div className="flex min-h-[calc(100vh-3rem)] flex-1 justify-center lg:min-h-[calc(100vh-5rem)]">
        <div className="flex w-full max-w-[600px] flex-col gap-10">
          <Stepper />
          <main id="obsah" className="flex flex-1 flex-col">
            {children}
          </main>
          <Footer />
        </div>
      </div>

      <DogPhoto />
    </div>
  )
}
