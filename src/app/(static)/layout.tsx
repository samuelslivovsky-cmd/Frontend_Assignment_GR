import type { ReactNode } from 'react'

import { Footer } from '@/components/layout/Footer'

export default function StaticLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1200px] flex-col gap-12 p-6 lg:p-10">
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
