import type { ReactNode } from 'react'

import { Footer } from '@/components/layout/Footer'

export default function StaticLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-10 p-6">
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  )
}
