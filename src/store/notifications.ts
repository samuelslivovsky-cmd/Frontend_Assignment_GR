import { create } from 'zustand'

import type { ApiMessageType } from '@/api/client'

export type Notification = {
  id: number
  type: ApiMessageType
  message: string
}

type NotificationStore = {
  notifications: Notification[]
  notify: (type: ApiMessageType, message: string) => void
  dismiss: (id: number) => void
}

let nextId = 0

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  notify: (type, message) =>
    set((state) => ({
      notifications: [...state.notifications, { id: (nextId += 1), type, message }],
    })),
  dismiss: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((notification) => notification.id !== id),
    })),
}))
