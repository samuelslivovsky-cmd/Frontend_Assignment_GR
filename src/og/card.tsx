import { ImageResponse } from 'next/og'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// The real wordmark, read once at build time.
const logoUri = `data:image/svg+xml;utf8,${encodeURIComponent(
  readFileSync(join(process.cwd(), 'public/images/logo.svg'), 'utf8'),
)}`

/**
 * Satori silently drops the bitmap photo, so the artwork is vector instead —
 * an SVG data URI renders reliably and keeps the card a few kilobytes.
 */
const DOG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
  <path d="M35 33c-7 2-11 7-11 14 0 6 2 9 5 9s5-3 5-8c0-6 0-11 1-15Z" transform="rotate(30 35 33)"/>
  <path d="M65 33c7 2 11 7 11 14 0 6-2 9-5 9s-5-3-5-8c0-6 0-11-1-15Z" transform="rotate(-30 65 33)"/>
  <ellipse cx="50" cy="52" rx="25" ry="24" fill="#4f46e5"/>
  <path d="M37 48c2-4 5-4 7 0"/>
  <path d="M56 48c2-4 5-4 7 0"/>
  <ellipse cx="50" cy="61" rx="12" ry="9"/>
  <ellipse cx="50" cy="56" rx="4" ry="3" fill="#fff" stroke="none"/>
  <path d="M50 59v3"/>
  <path d="M42 63c2 5 6 5 8 0"/>
  <path d="M50 63c2 5 6 5 8 0"/>
  <path d="M46 67h8v4a4 4 0 0 1-8 0Z" fill="#fff" fill-opacity="0.35"/>
  <path d="M0 -6c1 4 2 5 6 6c-4 1-5 2-6 6c-1-4-2-5-6-6c4-1 5-2 6-6Z" fill="#fff" stroke="none" transform="translate(16 24)"/>
  <path d="M0 -6c1 4 2 5 6 6c-4 1-5 2-6 6c-1-4-2-5-6-6c4-1 5-2 6-6Z" fill="#fff" stroke="none" transform="translate(86 20) scale(0.75)"/>
</svg>`

const dogUri = `data:image/svg+xml;utf8,${encodeURIComponent(DOG)}`

/** Shared social card so every route renders the same layout with its own wording. */
export function ogCard(title: string, subtitle: string) {
  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%', background: '#fff' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: 760,
            padding: 64,
          }}
        >
          <div style={{ display: 'flex' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoUri} width={186} height={48} alt="Good boy" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ fontSize: 62, fontWeight: 700, lineHeight: 1.1, color: '#111827' }}>
              {title}
            </div>
            <div style={{ fontSize: 28, lineHeight: 1.4, color: '#4b5563' }}>{subtitle}</div>
          </div>

          <div style={{ display: 'flex', fontSize: 24, color: '#4f46e5' }}>
            Podporte slovenské útulky pre psov
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 440,
            height: '100%',
            background: '#4f46e5',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={dogUri} width={300} height={300} alt="" />
        </div>
      </div>
    ),
    size,
  )
}
