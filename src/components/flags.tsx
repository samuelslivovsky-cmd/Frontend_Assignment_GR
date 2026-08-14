import type { ComponentProps } from 'react'

type FlagProps = ComponentProps<'svg'>

const BASE = { width: 20, height: 20, viewBox: '0 0 20 20', 'aria-hidden': true } as const

// SK is exported from the Figma file; CZ is drawn to match its circular style.
export function FlagSK(props: FlagProps) {
  return (
    <svg {...BASE} fill="none" {...props}>
      <path
        d="M10 20c5.523 0 10-4.477 10-10 0-1.223-.22-2.395-.622-3.478H.622A9.968 9.968 0 0 0 0 10c0 5.523 4.477 10 10 10Z"
        fill="#0052B4"
      />
      <path d="M10 20a10.002 10.002 0 0 0 9.378-6.522H.622A10.002 10.002 0 0 0 10 20Z" fill="#D80027" />
      <path d="M2.585 5.652v4.988c0 2.838 3.708 3.707 3.708 3.707S10 13.478 10 10.64V5.652H2.585Z" fill="#F0F0F0" />
      <path
        d="M3.455 5.652v4.988c0 .333.074.648.22.943h5.234c.147-.295.221-.61.221-.943V5.652H3.455Z"
        fill="#D80027"
      />
      <path
        d="M8.032 9.13H6.728V8.26h.87v-.869h-.87v-.87h-.87v.87h-.87v.87h.87v.87H4.554v.87h1.304v.869h.87V10h1.304v-.87Z"
        fill="#F0F0F0"
      />
      <path
        d="M4.862 12.798c.56.352 1.136.556 1.43.647.295-.09.871-.295 1.431-.647.565-.355.961-.761 1.186-1.214a2.02 2.02 0 0 0-1.223-.28 2.13 2.13 0 0 0-3.686 0 2.02 2.02 0 0 0-1.223.28c.225.453.621.86 1.186 1.214Z"
        fill="#0052B4"
      />
    </svg>
  )
}

export function FlagCZ(props: FlagProps) {
  return (
    <svg {...BASE} fill="none" {...props}>
      <circle cx="10" cy="10" r="10" fill="#F0F0F0" />
      <path d="M10 20a10 10 0 0 0 10-10H0a10 10 0 0 0 10 10Z" fill="#D80027" />
      <path d="M2.929 2.929a10 10 0 0 0 0 14.142L10 10 2.929 2.929Z" fill="#0052B4" />
    </svg>
  )
}
