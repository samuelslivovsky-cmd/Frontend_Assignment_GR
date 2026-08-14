import type { Metadata } from 'next'
import Link from 'next/link'

import { ContributionResults } from '@/features/donation/ContributionResults'

export const metadata: Metadata = {
  title: 'O projekte',
  description:
    'Nadácia Good Boy zachraňuje opustené a týrané psy v Žiline. Pozrite si, koľko sa už podarilo vyzbierať.',
}

const PARAGRAPHS = [
  'Nadácia Good Boy sa venuje zlepšovaniu života psov v Žiline na Slovensku. Zachraňujeme opustené, týrané a bezdomovské psy, poskytujeme im lekársku starostlivosť, útočisko a lásku, ktorú si zaslúžia. Naším poslaním je dať týmto verným spoločníkom druhú šancu na život tým, že im nájdeme milujúci domov. Okrem záchrany a rehabilitácie sa zameriavame aj na podporu zodpovedného vlastníctva zvierat a ochrany zvierat prostredníctvom vzdelávacích a komunitných programov.',
  'Naša práca je možná vďaka podpore vášnivých dobrovoľníkov, štedrých darcov a komunity, ktorá sa hlboko stará o dobro zvierat. Organizujeme aj kastračné a sterilizačné iniciatívy, aby sme riešili problém túlavých psov a zabezpečili dlhodobý vplyv. V nadácii Good Boy veríme, že každý pes si zaslúži bezpečný, milujúci domov a šťastný život. Pridajte sa k nám a pomôžte nám robiť zmeny – či už dobrovoľníctvom, darovaním alebo adopciou chlpatého priateľa. Spoločne môžeme vytvoriť lepšiu budúcnosť pre psy v Žiline.',
]

export default function AboutPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-10">
      <Link href="/" className="text-sm text-indigo-600 hover:underline">
        ← Späť
      </Link>
      <h1 className="text-5xl font-bold tracking-tight">O projekte</h1>
      <p className="text-gray-700">{PARAGRAPHS[0]}</p>
      <div className="border-y border-gray-200 py-10">
        <ContributionResults />
      </div>
      <p className="text-gray-700">{PARAGRAPHS[1]}</p>
    </main>
  )
}
