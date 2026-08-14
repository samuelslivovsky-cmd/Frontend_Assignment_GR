'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MotionConfig } from 'motion/react'
import { useEffect, useState, type ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'

import i18n, { applyPreferredLocale } from '@/i18n/client'

export function Providers({ children }: { children: ReactNode }) {
  // Created in state so each browser session gets its own cache, never a module-level singleton.
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 60_000, retry: 1 } } }),
  )

  // Switching language before hydration would make the client markup disagree with the server.
  useEffect(applyPreferredLocale, [])

  return (
    <I18nextProvider i18n={i18n}>
      {/* Honours the OS "reduce motion" setting for every animation in the app. */}
      <MotionConfig reducedMotion="user">
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </MotionConfig>
    </I18nextProvider>
  )
}
