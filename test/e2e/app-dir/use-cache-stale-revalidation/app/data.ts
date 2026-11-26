import { cacheLife, cacheTag } from 'next/cache'

export async function getSlug(slug: string) {
  'use cache'

  cacheLife('days')
  cacheTag('use-cache-stale-revalidation:all-slugs')

  return `${slug}:${Math.random()}`
}
