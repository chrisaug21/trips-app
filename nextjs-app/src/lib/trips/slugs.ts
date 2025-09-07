export function generateTripSlug(title?: string): string {
  const base = (title || 'untitled-trip')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

  const suffix = Math.random().toString(36).slice(2, 7)
  return `${base}-${suffix}`
}


