import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getLabBySlug, getAdjacentLabs, getAllLabSlugs } from '@/lib/labs';
import { LabDetailView } from '@/components/LabDetailView';

export function generateStaticParams() {
  return getAllLabSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lab = getLabBySlug(slug);
  if (!lab) return {};
  return { title: `${lab.meta.title} - 황선윤 포트폴리오` };
}

export default async function LabDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lab = getLabBySlug(slug);
  if (!lab) notFound();
  const { prev, next } = getAdjacentLabs(slug);
  return <LabDetailView lab={lab} prev={prev} next={next} />;
}
