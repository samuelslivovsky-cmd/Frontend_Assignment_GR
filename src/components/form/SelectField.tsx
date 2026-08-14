'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'

import { Check, ChevronDown } from '@/components/icons'

import { useFieldAria } from './Field'

export type SelectOption = {
  value: string
  label: string
  icon?: ReactNode
}

type SelectFieldProps = {
  id?: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  /** `compact` shows only the icon in the trigger — used by the phone prefix. */
  variant?: 'default' | 'compact'
  'aria-label'?: string
}

const TYPEAHEAD_RESET_MS = 600

/**
 * A native <select> cannot style its dropdown — the operating system draws it.
 * This is the accessible listbox pattern instead: the trigger keeps focus and
 * points at the highlighted option through `aria-activedescendant`.
 */
export function SelectField({
  id,
  value,
  onChange,
  onBlur,
  options,
  placeholder,
  disabled,
  variant = 'default',
  'aria-label': ariaLabel,
}: SelectFieldProps) {
  const { describedBy, invalid } = useFieldAria()
  const listId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const typeahead = useRef({ query: '', at: 0 })

  const [isOpen, setOpen] = useState(false)
  const selectedIndex = options.findIndex((option) => option.value === value)
  const [activeIndex, setActiveIndex] = useState(Math.max(selectedIndex, 0))

  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined

  useEffect(() => {
    if (!isOpen) return

    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    listRef.current?.children[activeIndex]?.scrollIntoView({ block: 'nearest' })
  }, [isOpen, activeIndex])

  const open = (index = Math.max(selectedIndex, 0)) => {
    setActiveIndex(index)
    setOpen(true)
  }

  const commit = (index: number) => {
    onChange(options[index].value)
    setOpen(false)
    onBlur?.()
  }

  const moveBy = (delta: number) =>
    setActiveIndex((current) => {
      const next = current + delta
      return Math.min(Math.max(next, 0), options.length - 1)
    })

  const jumpToTyped = (key: string) => {
    const now = Date.now()
    const query =
      now - typeahead.current.at > TYPEAHEAD_RESET_MS ? key : typeahead.current.query + key
    typeahead.current = { query, at: now }

    const match = options.findIndex((option) =>
      option.label.toLowerCase().startsWith(query.toLowerCase()),
    )
    if (match >= 0) {
      setActiveIndex(match)
      if (!isOpen) onChange(options[match].value)
    }
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault()
        if (!isOpen) return open()
        return moveBy(event.key === 'ArrowDown' ? 1 : -1)
      case 'Home':
        if (!isOpen) return
        event.preventDefault()
        return setActiveIndex(0)
      case 'End':
        if (!isOpen) return
        event.preventDefault()
        return setActiveIndex(options.length - 1)
      case 'Enter':
      case ' ':
        event.preventDefault()
        return isOpen ? commit(activeIndex) : open()
      case 'Escape':
        if (!isOpen) return
        event.preventDefault()
        return setOpen(false)
      case 'Tab':
        return setOpen(false)
      default:
        if (event.key.length === 1 && !event.metaKey && !event.ctrlKey) jumpToTyped(event.key)
    }
  }

  const isCompact = variant === 'compact'

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        id={id}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-haspopup="listbox"
        aria-activedescendant={isOpen ? `${listId}-${activeIndex}` : undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => (isOpen ? setOpen(false) : open())}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        className={`flex w-full items-center gap-2 rounded-lg bg-gray-100 py-3 text-left text-gray-900 aria-invalid:outline-2 aria-invalid:outline-red-600 disabled:opacity-60 ${
          isCompact ? 'justify-center px-3' : 'px-4'
        }`}
      >
        {selected?.icon}
        {!isCompact && (
          <span className={`flex-1 truncate ${value ? '' : 'text-gray-400'}`}>
            {selected?.label ?? placeholder}
          </span>
        )}
        <ChevronDown className="shrink-0 text-gray-500" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            ref={listRef}
            id={listId}
            role="listbox"
            aria-label={ariaLabel}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.14, ease: 'easeOut' }}
            className="absolute z-30 mt-2 max-h-72 w-full min-w-max overflow-auto rounded-xl border border-gray-200 bg-white p-1 shadow-xl"
          >
            {options.map((option, index) => {
              const isSelected = option.value === value

              return (
                <li
                  key={option.value}
                  id={`${listId}-${index}`}
                  role="option"
                  aria-selected={isSelected}
                  onPointerEnter={() => setActiveIndex(index)}
                  onClick={() => commit(index)}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                    index === activeIndex ? 'bg-indigo-50' : ''
                  } ${isSelected ? 'font-semibold text-indigo-700' : 'text-gray-900'}`}
                >
                  {option.icon}
                  <span className="flex-1">{option.label}</span>
                  {isSelected && <Check width={16} height={16} className="text-indigo-600" />}
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
