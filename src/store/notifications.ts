import { create } from 'zustand'

import type { ApiMessageType } from '@/api/client'

export type Notification = {
  id: number
  type: ApiMessageType
  message: string
  fieldId?: string
}

type NotifyOptions = { fieldId?: string }

type NotificationStore = {
  notifications: Notification[]
  notify: (type: ApiMessageType, message: string, options?: NotifyOptions) => void
  dismiss: (id: number) => void
  clear: () => void
}

let nextId = 0

const LIFETIME_MS = 10_000

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  notify: (type, message, options) => {
    const id = (nextId += 1)

    set((state) => ({
      notifications: [...state.notifications, { id, type, message, ...options }],
    }))
    setTimeout(() => get().dismiss(id), LIFETIME_MS)
  },
  dismiss: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((notification) => notification.id !== id),
    })),
  clear: () => set({ notifications: [] }),
}))
