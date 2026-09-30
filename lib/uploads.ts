import path from 'node:path'

// Uploaded images are kept next to the embedded database, outside public/,
// because files added to public/ after a build are not served in production.
export const uploadsDir = path.join(process.cwd(), '.data', 'uploads')

export const imageTypes: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
}

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024
