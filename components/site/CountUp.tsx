'use client'

import { useEffect, useRef, useState } from 'react'

export function CountUp({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    const node = ref.current
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setDisplay(0)
    let frame = 0
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      const start = performance.now()
      const tick = (now: number) => {
        const progress = Math.min((now - start) / 1600, 1)
        setDisplay(Math.round(value * (1 - Math.pow(1 - progress, 3))))
        if (progress < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }, { threshold: 0.4 })
    observer.observe(node)
    return () => { observer.disconnect(); cancelAnimationFrame(frame) }
  }, [value])

  return <span ref={ref}>{display}{suffix}</span>
}
