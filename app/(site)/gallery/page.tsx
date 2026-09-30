import type { Metadata } from 'next'
import { GalleryLightbox } from '@/components/site/GalleryLightbox'
import { PageHero } from '@/components/site/PageHero'

export const metadata: Metadata = { title: 'Gallery' }

const images = [
  { caption: 'Boardroom & Negotiations', alt: "Contemporary boardroom with glass walls used for client negotiations", thumb: 'https://images.pexels.com/photos/5444180/pexels-photo-5444180.jpeg?auto=compress&cs=tinysrgb&w=900', full: 'https://images.pexels.com/photos/5444180/pexels-photo-5444180.jpeg?auto=compress&cs=tinysrgb&w=1600' },
  { caption: 'Client Meeting Room', alt: 'Spacious meeting room with a large table for client consultations', thumb: 'https://images.pexels.com/photos/33827319/pexels-photo-33827319.jpeg?auto=compress&cs=tinysrgb&w=900', full: 'https://images.pexels.com/photos/33827319/pexels-photo-33827319.jpeg?auto=compress&cs=tinysrgb&w=1600' },
  { caption: "Advocates' Workspace", alt: "Open, modern office workspace for the firm's advocates", thumb: 'https://images.pexels.com/photos/5444186/pexels-photo-5444186.jpeg?auto=compress&cs=tinysrgb&w=900', full: 'https://images.pexels.com/photos/5444186/pexels-photo-5444186.jpeg?auto=compress&cs=tinysrgb&w=1600' },
  { caption: 'Consultation Suite', alt: 'Conference room with natural lighting used for client consultations', thumb: 'https://images.pexels.com/photos/33827311/pexels-photo-33827311.jpeg?auto=compress&cs=tinysrgb&w=900', full: 'https://images.pexels.com/photos/33827311/pexels-photo-33827311.jpeg?auto=compress&cs=tinysrgb&w=1600' },
  { caption: 'Modern Practice Spaces', alt: 'Bright, modern office space with ergonomic seating', thumb: 'https://images.pexels.com/photos/33935830/pexels-photo-33935830.jpeg?auto=compress&cs=tinysrgb&w=900', full: 'https://images.pexels.com/photos/33935830/pexels-photo-33935830.jpeg?auto=compress&cs=tinysrgb&w=1600' },
  { caption: 'Strategy & Case Review', alt: 'Empty modern conference room set up for a strategy session', thumb: 'https://images.pexels.com/photos/5387614/pexels-photo-5387614.jpeg?auto=compress&cs=tinysrgb&w=900', full: 'https://images.pexels.com/photos/5387614/pexels-photo-5387614.jpeg?auto=compress&cs=tinysrgb&w=1600' },
]

export default function GalleryPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Gallery' }]}
        eyebrow="Our Environment"
        title="A practice built for confidence."
        description="Step inside the spaces where strategy, negotiation and counsel come together for our clients."
        image="https://images.pexels.com/photos/5444180/pexels-photo-5444180.jpeg?auto=compress&cs=tinysrgb&w=1000"
      />
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <GalleryLightbox images={images} />
        </div>
      </section>
    </>
  )
}
