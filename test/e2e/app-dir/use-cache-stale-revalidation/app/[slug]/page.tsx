import { getSlug } from '../data'

export function generateStaticParams() {
  return [{ slug: 'some-slug' }]
}

export default async function Page({
  params,
}: PageProps<'/[slug]'>) {
  const { slug } = await params
  return <p>{await getSlug(slug)}</p>
}
