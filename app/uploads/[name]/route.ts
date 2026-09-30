import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { imageTypes, uploadsDir } from '@/lib/uploads'

const typesByExtension = Object.fromEntries(Object.entries(imageTypes).map(([type, extension]) => [extension, type]))

export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  const type = typesByExtension[name.split('.').pop() ?? '']
  if (!/^[\w-]+\.\w+$/.test(name) || !type) return new Response('Not found', { status: 404 })
  try {
    const file = await readFile(path.join(uploadsDir, name))
    return new Response(file, { headers: { 'Content-Type': type, 'Cache-Control': 'public, max-age=31536000, immutable' } })
  } catch {
    return new Response('Not found', { status: 404 })
  }
}
