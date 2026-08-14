'use client'

import type { ApiMessageType } from '@/api/client'
import { useNotificationStore } from '@/store/notifications'

const TONE: Record<ApiMessageType, string> = {
  SUCCESS: 'border-green-600 text-green-800',
  ERROR: 'border-red-600 text-red-800',
  WARNING: 'border-amber-600 text-amber-800',
  INFO: 'border-slate-400 text-slate-800',
}

export function Notifications() {
  const notifications = useNotificationStore((state) => state.notifications)
  const dismiss = useNotificationStore((state) => state.dismiss)

  if (notifications.length === 0) return null

  return (
    <div role="status" aria-live="polite" className="fixed top-4 right-4 flex w-80 flex-col gap-2">
      {notifications.map(({ id, type, message }) => (
        <div
          key={id}
          className={`flex items-start gap-3 rounded border bg-white p-3 text-sm shadow ${TONE[type]}`}
        >
          <p className="flex-1">{message}</p>
          <button type="button" onClick={() => dismiss(id)} aria-label="Zavrieť oznámenie">
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
