import type { ContributionPayload } from '@/lib/api/shelters'

import type { DonationFormValues } from './schema'

// `contributors` is an array on the API, so multi-donor support later needs no payload change.
export function toContributionPayload(values: DonationFormValues): ContributionPayload {
  return {
    contributors: [
      {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: `${values.phonePrefix}${values.phone}`,
      },
    ],
    shelterID: values.target === 'SHELTER' ? values.shelterId : null,
    value: values.amount,
  }
}
