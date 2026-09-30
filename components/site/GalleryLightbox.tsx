'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

export type GalleryImage = { caption: string; thumb: string; full: string; alt: string }

export function GalleryLightbox({ images }: { images: GalleryImage[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  useEffect(() => {
    if (openIndex === null) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenIndex(null)
      if (event.key === 'ArrowLeft') setOpenIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length))
      if (event.key === 'ArrowRight') setOpenIndex((i) => (i === null ? i : (i + 1) % images.length))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openIndex, images.length])

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {images.map((image, index) => (
          <button key={image.caption} onClick={() => setOpenIndex(index)} className="group relative aspect-[4/3] rounded-lg overflow-hidden text-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.thumb} alt={image.alt} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
            <span className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/0 to-navy/0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition">
              <span className="text-white text-[13px] font-semibold">{image.caption}</span>
            </span>
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setOpenIndex(null) }}>
          <button className="absolute top-5 right-5 text-white/80 hover:text-white" onClick={() => setOpenIndex(null)} aria-label="Close"><X size={26} /></button>
          <button className="absolute left-4 md:left-8 text-white/70 hover:text-white" onClick={() => setOpenIndex((openIndex - 1 + images.length) % images.length)} aria-label="Previous image"><ChevronLeft size={32} /></button>
          <div className="max-w-4xl w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[openIndex].full} alt={images[openIndex].alt} className="w-full max-h-[80vh] object-contain" />
            <p className="text-white/70 text-center text-[12px] mt-3">{images[openIndex].caption}</p>
          </div>
          <button className="absolute right-4 md:right-8 text-white/70 hover:text-white" onClick={() => setOpenIndex((openIndex + 1) % images.length)} aria-label="Next image"><ChevronRight size={32} /></button>
        </div>
      )}
    </>
  )
}
