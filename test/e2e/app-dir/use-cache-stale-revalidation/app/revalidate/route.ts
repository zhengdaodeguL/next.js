import { revalidateTag } from 'next/cache'

export async function POST() {
  revalidateTag('use-cache-stale-revalidation:all-slugs', 'max')
  return new Response(null, { status: 204 })
}
