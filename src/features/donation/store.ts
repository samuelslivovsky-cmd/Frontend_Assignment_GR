import { create } from 'zustand'

import type { PersonalStepValues, ShelterStepValues } from './schema'

type CompletedDonation = {
  amount: number
  /** Optional confirmation text the API returned, shown on the thank-you page. */
  message?: string
}

type DonationStore = {
  shelter: ShelterStepValues | null
  personal: PersonalStepValues | null
  completed: CompletedDonation | null
  setShelter: (values: ShelterStepValues) => void
  setPersonal: (values: PersonalStepValues) => void
  complete: (donation: CompletedDonation) => void
  clearDraft: () => void
  reset: () => void
}

// Holds the wizard draft between step routes; each step is a separate page.
export const useDonationStore = create<DonationStore>((set) => ({
  shelter: null,
  personal: null,
  completed: null,
  // Starting a new donation clears the previous confirmation.
  setShelter: (shelter) => set({ shelter, completed: null }),
  setPersonal: (personal) => set({ personal }),
  complete: (completed) => set({ completed }),
  // Cleared by the thank-you page, not on submit — wiping it while the
  // confirmation step is still mounted would trip its RequireDraft guard.
  clearDraft: () => set({ shelter: null, personal: null }),
  reset: () => set({ shelter: null, personal: null, completed: null }),
}))
