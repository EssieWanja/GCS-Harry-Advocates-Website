'use client'

import { useRef, useState } from 'react'
import { ImagePlus, Loader2, X } from 'lucide-react'

/** Image picker: upload a file from the computer or paste an image link. */
export function ImageField({ value, onChange, inputClass }: { value: string; onChange: (value: string) => void; inputClass: string }) {
  const fileInput = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const upload = async (file: File) => {
    setUploading(true)
    setError('')
    const body = new FormData()
    body.append('file', file)
    try {
      const response = await fetch('/api/admin/upload', { method: 'POST', body })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok) setError(payload.error ?? 'Upload failed. Please try again.')
      else onChange(payload.url)
    } catch {
      setError('Upload failed. Please check your connection and try again.')
    }
    setUploading(false)
  }

  return (
    <div className="flex gap-3 items-start">
      <div className="w-20 h-20 shrink-0 rounded-md border border-line bg-canvas overflow-hidden grid place-items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {value ? <img src={value} alt="" className="w-full h-full object-cover" /> : <ImagePlus size={20} className="text-muted" />}
      </div>
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex gap-2">
          <button type="button" onClick={() => fileInput.current?.click()} disabled={uploading} className="inline-flex items-center gap-1.5 border border-line rounded-md px-3 py-2 text-[12px] font-semibold text-navy bg-white hover:bg-canvas disabled:opacity-60">
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />} {uploading ? 'Uploading…' : 'Upload image'}
          </button>
          {value && (
            <button type="button" onClick={() => onChange('')} className="inline-flex items-center gap-1 text-[12px] text-muted hover:text-red-700 px-2">
              <X size={14} /> Remove
            </button>
          )}
        </div>
        <input value={value} onChange={(event) => onChange(event.target.value)} placeholder="…or paste an image link (https://…)" className={inputClass} />
        {error && <p className="text-[11px] text-red-700">{error}</p>}
        <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) upload(file); event.target.value = '' }} />
      </div>
    </div>
  )
}
