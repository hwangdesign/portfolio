import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { getProjectBySlug, getProjectSlugs } from '@/lib/projects';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { meta } = getProjectBySlug(slug);
    return {
      title: `${meta.title} — 황선윤 포트폴리오`,
      description: meta.summary || meta.problem || meta.title,
    };
  } catch {
    return { title: 'Project' };
  }
}

export default async function ProjectCasePage({ params }: Props) {
  const { slug } = await params;
  let data: ReturnType<typeof getProjectBySlug>;
  try {
    data = getProjectBySlug(slug);
  } catch {
    notFound();
  }
  const { meta, content } = data;

  return (
    <main className="main-content">
      <div className="divider" />
      <section className="section hero-content-section" aria-label="요약">
        <div className="container">
          <div className="hero-content">
            <div className="project-date">
              {meta.date.replace(/^(\d{4})-(\d{2}).*/, '$1/$2')}
            </div>
            <h1 className="section-title">{meta.title}</h1>
            {meta.summary ? (
              <p className="hero-info-description" style={{ marginTop: '0.75rem' }}>
                {meta.summary}
              </p>
            ) : null}
            <p style={{ marginTop: '1rem', opacity: 0.75, fontSize: '0.9rem' }}>
              <Link href="/projects/">← Works 목록</Link>
            </p>
          </div>
        </div>
      </section>

      <div className="divider" />
      <section className="section project-details-section" aria-label="케이스 스터디">
        <div className="container">
          <div className="project-details-content markdown-body">
            <ReactMarkdown
              components={{
                img: ({ src, alt }) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={typeof src === 'string' ? src : ''}
                    alt={alt || ''}
                    className="project-image project-image-detail"
                    loading="lazy"
                  />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </section>
    </main>
  );
}
