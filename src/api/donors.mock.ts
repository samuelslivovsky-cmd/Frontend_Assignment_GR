import type { Donor } from './donors'

/**
 * Illustrative donors: the public API exposes only how many people gave, never who.
 * Generated rather than written out so the file stays readable, and seeded so every
 * reload shows the same people — a list that reshuffles itself reads as a bug.
 *
 * Names are drawn per gender because Slovak surnames carry it; picking from one pool
 * would produce "Katarína Novák".
 */
const PEOPLE = [
  {
    first: ['Samuel', 'Peter', 'Martin', 'Tomáš', 'Michal', 'Jakub', 'Andrej', 'Marek', 'Filip'],
    last: ['Slivovský', 'Novák', 'Baláž', 'Krajčí', 'Benko', 'Hrubý', 'Poliak', 'Marček', 'Šimko'],
  },
  {
    first: ['Katarína', 'Zuzana', 'Lucia', 'Veronika', 'Simona', 'Barbora', 'Nikola', 'Eva'],
    last: [
      'Girgová',
      'Kováčová',
      'Horváthová',
      'Šimková',
      'Ondrušová',
      'Vargová',
      'Danišová',
      'Tomková',
    ],
  },
]

const AMOUNTS = [5, 10, 10, 20, 20, 30, 50, 50, 100, 7, 15, 25, 42, 75, 120, 250]

/** Ids as returned by the live shelter endpoint. 12 is left out so a shelter with no
 *  donations yet — and with it the list's empty state — is reachable in the UI. */
const SHELTER_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16]

const FOUNDATION_SHARE = 0.15
const DONOR_COUNT = 52

/** Mulberry32 — a few lines of arithmetic instead of a dependency. */
function seededRandom(seed: number) {
  let state = seed

  return () => {
    state = (state + 0x6d2b79f5) | 0
    let value = Math.imul(state ^ (state >>> 15), 1 | state)
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Dates count back from the moment the list is first asked for, not from a fixed day,
 * so "3 days ago" stays true however long the project sits unused. Safe because this
 * only ever runs in the browser — the query has no server prefetch to disagree with.
 */
export function buildPlaceholderDonors(): Donor[] {
  const random = seededRandom(20260815)
  const pick = <T>(items: T[]) => items[Math.floor(random() * items.length)]

  const now = Date.now()
  const hour = 60 * 60 * 1000

  let hoursAgo = 2

  return Array.from({ length: DONOR_COUNT }, (_, index) => {
    // Gaps widen as the list goes back: the newest are hours apart, the oldest months.
    hoursAgo += 3 + Math.floor(random() * (6 + index * 8))

    const person = pick(PEOPLE)

    return {
      id: `donor-${index + 1}`,
      firstName: pick(person.first),
      lastName: pick(person.last),
      amount: pick(AMOUNTS),
      shelterId: random() < FOUNDATION_SHARE ? null : pick(SHELTER_IDS),
      donatedAt: new Date(now - hoursAgo * hour).toISOString(),
    }
  })
}
