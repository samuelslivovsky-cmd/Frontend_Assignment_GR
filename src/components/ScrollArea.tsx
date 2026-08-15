import type { ReactNode } from 'react'

/**
 * The step's body: from `lg` it takes the room the fixed heading and actions leave
 * over and scrolls what does not fit, so a scrollbar means there is no room left.
 * `min-h-0` permits the shrinking a flex item otherwise refuses; the negative margins
 * hand back the room a focus ring needs, since `overflow-y` clips both axes.
 */
const SCROLL_AREA =
  'relative lg:-m-1 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:p-1 lg:pr-3 lg:[scrollbar-color:var(--color-gray-300)_transparent] lg:[scrollbar-width:thin]'

export function ScrollArea({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div data-scroll-area className={`${SCROLL_AREA} ${className ?? ''}`}>
      {children}
    </div>
  )
}
