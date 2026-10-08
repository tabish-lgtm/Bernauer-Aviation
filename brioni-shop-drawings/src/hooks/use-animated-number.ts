import { useEffect, useRef, useState } from 'react'

/** Eases a number toward its new value, so totals tick rather than jump. */
export function useAnimatedNumber(value: number, duration = 450) {
  const [shown, setShown] = useState(value)
  const from = useRef(value)
  const current = useRef(value)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    from.current = current.current
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const t = reduce ? 1 : Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      current.current = from.current + (value - from.current) * eased
      setShown(current.current)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value, duration])

  return shown
}
