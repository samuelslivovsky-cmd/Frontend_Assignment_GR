import { ContributionResults } from '@/features/donation/ContributionResults'
import { DonationForm } from '@/features/donation/DonationForm'

export default function DonatePage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-8 p-4 py-10">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold">Pomôžte psíkom v útulkoch</h1>
        <ContributionResults />
      </div>
      <DonationForm />
    </main>
  )
}
