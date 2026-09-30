'use client'

import { useEffect, useState } from 'react'

// How long each photo stays on screen before the next one fades in.
const SLIDE_INTERVAL_MS = 1000

export function HeroSlider({ images }: { images: { src: string; alt: string }[] }) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => setActive((current) => (current + 1) % images.length), SLIDE_INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [images.length])

  return (
    <>
      {images.map((image, index) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={image.src}
          src={image.src}
          alt={image.alt}
          aria-hidden={index !== active}
          fetchPriority={index === 0 ? 'high' : 'auto'}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out hero-kenburns ${index === active ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
      <div className="absolute bottom-20 right-6 md:right-10 z-10 flex gap-2" aria-hidden>
        {images.map((image, index) => (
          <span key={image.src} className={`h-1 rounded-full transition-all duration-500 ${index === active ? 'w-8 bg-gold' : 'w-3 bg-white/40'}`} />
        ))}
      </div>
    </>
  )
}
