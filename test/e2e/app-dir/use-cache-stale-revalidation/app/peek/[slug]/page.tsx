import { Suspense } from 'react'
import { connection } from 'next/server'
import { getSlug } from '../../data'

async function CachedSlug({ slug }: { slug: string }) {
  await connection()
  return <p>{await getSlug(slug)}</p>
}

export default async function Page({
  params,
}: PageProps<'/peek/[slug]'>) {
  const { slug } = await params

  return (
    <Suspense fallback="loading cached slug">
      <CachedSlug slug={slug} />
    </Suspense>
  )
}
