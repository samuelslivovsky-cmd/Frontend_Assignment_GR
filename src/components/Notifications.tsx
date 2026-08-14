'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'

import type { ApiMessageType } from '@/api/client'
import { useNotificationStore } from '@/store/notifications'

const TONE: Record<ApiMessageType, string> = {
  SUCCESS: 'border-green-600 text-green-800',
  ERROR: 'border-red-600 text-red-800',
  WARNING: 'border-amber-600 text-amber-800',
  INFO: 'border-gray-300 text-gray-800',
}

export function Notifications() {
  const { t } = useTranslation()
  const notifications = useNotificationStore((state) => state.notifications)
  const dismiss = useNotificationStore((state) => state.dismiss)

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed top-4 right-4 left-4 z-50 flex flex-col gap-2 sm:left-auto sm:w-80"
    >
      <AnimatePresence initial={false}>
        {notifications.map(({ id, type, message }) => (
          <motion.div
            key={id}
            layout
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className={`pointer-events-auto flex items-start gap-3 rounded-lg border bg-white p-3 text-sm shadow ${TONE[type]}`}
          >
            <p className="flex-1">{message}</p>
            <button
              type="button"
              onClick={() => dismiss(id)}
              aria-label={t('common.dismissNotification')}
            >
              ×
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
