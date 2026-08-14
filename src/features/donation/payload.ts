import type { ContributionPayload } from '@/api/shelters'

import type { PersonalStepValues, ShelterStepValues } from './schema'

type DonationDraft = {
  shelter: ShelterStepValues
  personal: PersonalStepValues
}

// `contributors` is an array on the API, so multi-donor support later needs no payload change.
export function toContributionPayload({ shelter, personal }: DonationDraft): ContributionPayload {
  return {
    contributors: [
      {
        firstName: personal.firstName,
        lastName: personal.lastName,
        email: personal.email,
        phone: `${personal.phonePrefix}${personal.phone}`,
      },
    ],
    shelterID: shelter.target === 'SHELTER' ? shelter.shelterId : null,
    value: shelter.amount,
  }
}
