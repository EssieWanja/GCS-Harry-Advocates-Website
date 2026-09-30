import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'
import { guard, jsonError } from '@/lib/admin-api'
import { imageTypes, MAX_UPLOAD_BYTES, uploadsDir } from '@/lib/uploads'

export async function POST(request: Request) {
  return guard(async () => {
    const file = (await request.formData()).get('file')
    if (!(file instanceof File)) return jsonError('Please choose an image to upload.')
    const extension = imageTypes[file.type]
    if (!extension) return jsonError('Please upload a JPG, PNG, WebP, GIF or AVIF image.')
    if (file.size > MAX_UPLOAD_BYTES) return jsonError('Images must be 5 MB or smaller.')
    await mkdir(uploadsDir, { recursive: true })
    const name = `${randomUUID()}.${extension}`
    await writeFile(path.join(uploadsDir, name), Buffer.from(await file.arrayBuffer()))
    return NextResponse.json({ url: `/uploads/${name}` }, { status: 201 })
  })
}
