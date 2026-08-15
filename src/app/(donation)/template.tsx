import type { ReactNode } from 'react'

/**
 * A template remounts on every navigation, which is what the enter animation needs.
 * It is deliberately CSS-driven and not a motion component: motion renders its
 * `initial` styles into the server HTML, so `opacity: 0` would hide the step —
 * skeletons included — until hydration finished.
 */
export default function DonationTemplate({ children }: { children: ReactNode }) {
  return <div className="step-enter flex flex-1 flex-col lg:min-h-0">{children}</div>
}
