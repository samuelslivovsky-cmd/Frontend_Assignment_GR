import { create } from 'zustand'

import type { PersonalStepValues, ShelterStepValues } from './schema'

type DonationStore = {
  shelter: ShelterStepValues | null
  personal: PersonalStepValues | null
  setShelter: (values: ShelterStepValues) => void
  setPersonal: (values: PersonalStepValues) => void
  reset: () => void
}

// Holds the wizard draft between step routes; each step is a separate page.
export const useDonationStore = create<DonationStore>((set) => ({
  shelter: null,
  personal: null,
  setShelter: (shelter) => set({ shelter }),
  setPersonal: (personal) => set({ personal }),
  reset: () => set({ shelter: null, personal: null }),
}))
