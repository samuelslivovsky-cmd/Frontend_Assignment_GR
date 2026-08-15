import type { ContributionPayload } from '@/api/shelters'

import type { PersonalStepValues, ShelterStepValues } from './schema'

type DonationDraft = {
  shelter: ShelterStepValues
  personal: PersonalStepValues
}

// The API carries one `value` for the whole contribution, so several donors share
// a single donation rather than each pledging their own amount.
export function toContributionPayload({ shelter, personal }: DonationDraft): ContributionPayload {
  return {
    contributors: personal.donors.map((donor) => ({
      firstName: donor.firstName,
      lastName: donor.lastName,
      email: donor.email,
      phone: `${donor.phonePrefix}${donor.phone}`,
    })),
    shelterID: shelter.target === 'SHELTER' ? shelter.shelterId : null,
    value: shelter.amount,
  }
}
