import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getWorkBySlug, getAdjacentWorks, getAllWorkSlugs } from '@/lib/works';
import { WorkDetailView } from '@/components/WorkDetailView';

export function generateStaticParams() {
  return getAllWorkSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const w = getWorkBySlug(slug);
  if (!w) return {};
  return { title: `${w.meta.title} - 황선윤 포트폴리오` };
}

export default async function WorkDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const work = getWorkBySlug(slug);
  if (!work) notFound();
  const { prev, next } = getAdjacentWorks(slug);
  return <WorkDetailView work={work} prev={prev} next={next} />;
}
