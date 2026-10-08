import { useState } from 'react'

import { Field } from '@/components/Field'
import { Input } from '@/components/ui/input'
import type { Units } from '@/lib/types'
import { parseLength, toInputValue } from '@/lib/units'

interface DimensionInputProps {
  id: string
  label: string
  value: number
  units: Units
  onChange: (inches: number) => void
  helper?: string
  min?: number
  max?: number
  className?: string
}

/**
 * A length field that speaks the fabricator's language: "25 1/2", "25.5"
 * and "25½" all work in inches, whole numbers in millimetres. The drawing
 * updates on every valid keystroke.
 */
export function DimensionInput({
  id,
  label,
  value,
  units,
  onChange,
  helper,
  min = 0,
  max = 1000,
  className,
}: DimensionInputProps) {
  const [text, setText] = useState('')
  const [focused, setFocused] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // While not being edited, always mirror the value (so dragging and unit switches show up).
  const shown = focused ? text : toInputValue(value, units)

  const unitWord = units === 'in' ? 'in' : 'mm'
  const example = units === 'in' ? 'like 25 1/2' : 'like 648'

  function handleChange(next: string) {
    setText(next)
    const parsed = parseLength(next, units)
    if (parsed === null) {
      setError(next.trim() ? `Enter a number ${example}.` : null)
      return
    }
    if (parsed < min - 1e-6 || parsed > max + 1e-6) {
      setError(`Enter a size between ${toInputValue(min, units)} and ${toInputValue(max, units)} ${unitWord}.`)
      return
    }
    setError(null)
    onChange(parsed)
  }

  return (
    <Field id={id} label={label} helper={helper} error={error} className={className}>
      <div className="relative">
        <Input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          value={shown}
          aria-invalid={!!error}
          aria-describedby={`${id}-help`}
          onFocus={(e) => {
            setText(toInputValue(value, units))
            setFocused(true)
            const input = e.currentTarget
            requestAnimationFrame(() => input.select())
          }}
          onBlur={() => {
            setFocused(false)
            setError(null)
          }}
          onChange={(e) => handleChange(e.target.value)}
          className="pr-10 font-mono text-[13px] tabular-nums"
        />
        <span className="text-muted-foreground pointer-events-none absolute inset-y-0 right-3 flex items-center text-[11px]">
          {unitWord}
        </span>
      </div>
    </Field>
  )
}
