/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // PGlite loads its WebAssembly and data files from its own package folder at runtime.
  serverExternalPackages: ['@electric-sql/pglite'],
  // Database migrations are read from disk when the server first connects.
  outputFileTracingIncludes: {
    '/**': ['./drizzle/**/*'],
  },
}

export default nextConfig
