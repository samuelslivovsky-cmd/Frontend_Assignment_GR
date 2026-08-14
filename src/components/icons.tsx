import type { ComponentProps } from 'react'

type IconProps = ComponentProps<'svg'>

// Size comes from width/height attributes, not a class, so a caller-supplied
// className can position the icon without wiping its dimensions.
const BASE = {
  width: 20,
  height: 20,
  viewBox: '0 0 20 20',
  'aria-hidden': true,
} as const

function Line({ children, ...props }: IconProps) {
  return (
    <svg
      {...BASE}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.67}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  )
}

export const ArrowLeft = (props: IconProps) => (
  <Line {...props}>
    <path d="M15.8 10H4.2m0 0 4.6 4.6M4.2 10l4.6-4.6" />
  </Line>
)

export const ArrowRight = (props: IconProps) => (
  <Line {...props}>
    <path d="M4.2 10h11.6m0 0-4.6-4.6m4.6 4.6-4.6 4.6" />
  </Line>
)

export const ChevronDown = (props: IconProps) => (
  <Line {...props}>
    <path d="m5 7.5 5 5 5-5" />
  </Line>
)

export const Check = (props: IconProps) => (
  <Line {...props}>
    <path d="m4.5 10.5 3.5 3.5 7.5-8" />
  </Line>
)

export const Mail = (props: IconProps) => (
  <Line {...props}>
    <path d="M2.5 6.25 9.06 10.6a1.7 1.7 0 0 0 1.88 0L17.5 6.25" />
    <rect x="2.5" y="4.17" width="15" height="11.67" rx="1.67" />
  </Line>
)

export const MapPin = (props: IconProps) => (
  <Line {...props}>
    <path d="M10 18.33s5.83-4.16 5.83-9.16a5.83 5.83 0 1 0-11.66 0c0 5 5.83 9.16 5.83 9.16Z" />
    <circle cx="10" cy="9.17" r="2.08" />
  </Line>
)

export const Phone = (props: IconProps) => (
  <Line {...props}>
    <path d="M6.87 3.4a.83.83 0 0 1 1.1.3l1.4 2.28c.2.32.15.73-.11 1l-.98.97a.42.42 0 0 0-.08.5 9.6 9.6 0 0 0 3.35 3.35c.17.1.38.06.5-.08l.97-.98c.27-.26.68-.3 1-.11l2.28 1.4c.36.22.49.68.3 1.1l-.6 1.34a1.67 1.67 0 0 1-1.78.96A14.17 14.17 0 0 1 3.67 5.05a1.67 1.67 0 0 1 .96-1.78l1.34-.6Z" />
  </Line>
)

export const Facebook = (props: IconProps) => (
  <svg {...BASE} fill="currentColor" {...props}>
    <path d="M10 1.7a8.3 8.3 0 0 0-1.3 16.5v-5.8H6.6V10h2.1V8.2c0-2.1 1.2-3.2 3.1-3.2.9 0 1.8.15 1.8.15v2h-1c-1 0-1.3.63-1.3 1.27V10h2.2l-.35 2.4h-1.85v5.8A8.3 8.3 0 0 0 10 1.7Z" />
  </svg>
)

// Scaled about the centre so its outline matches Facebook's optical size —
// the raw glyph is drawn noticeably smaller inside the same 20px box.
export const Instagram = (props: IconProps) => (
  <svg {...BASE} fill="currentColor" {...props}>
    <path
      transform="translate(10 10) scale(1.22) translate(-10 -10)"
      d="M10 3.2c2.2 0 2.46 0 3.33.05.8.04 1.24.17 1.53.29.38.15.66.33.95.62.29.29.47.57.62.95.11.29.25.73.29 1.53.04.87.05 1.13.05 3.33s0 2.46-.05 3.33c-.04.8-.18 1.24-.29 1.53a2.5 2.5 0 0 1-.62.95c-.29.29-.57.47-.95.62-.29.11-.73.25-1.53.29-.87.04-1.13.05-3.33.05s-2.46 0-3.33-.05c-.8-.04-1.24-.18-1.53-.29a2.5 2.5 0 0 1-.95-.62 2.5 2.5 0 0 1-.62-.95c-.11-.29-.25-.73-.29-1.53C3.2 12.46 3.2 12.2 3.2 10s0-2.46.05-3.33c.04-.8.18-1.24.29-1.53.15-.38.33-.66.62-.95.29-.29.57-.47.95-.62.29-.12.73-.25 1.53-.29C7.54 3.2 7.8 3.2 10 3.2Zm0 3.3a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm0 5.77a2.27 2.27 0 1 1 0-4.54 2.27 2.27 0 0 1 0 4.54Zm4.46-5.91a.82.82 0 1 1-1.63 0 .82.82 0 0 1 1.63 0Z"
    />
  </svg>
)
