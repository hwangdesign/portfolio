import dynamic from 'next/dynamic';
import type { WorkEntry } from '@/lib/works';
import { ProjectNavLinks } from '@/components/ProjectNavLinks';
import { ProjectKeyboardNav } from '@/components/ProjectKeyboardNav';
import { CtaArrowIcon } from '@/components/CtaArrowIcon';
import { KittiesDetailLottie } from '@/components/KittiesDetailLottie';

const MarkdownBody = dynamic(() =>
  import('@/components/MarkdownBody').then((m) => ({ default: m.MarkdownBody }))
);

type Props = {
  work: WorkEntry;
  prev: WorkEntry | null;
  next: WorkEntry | null;
};

export function WorkDetailView({ work, prev, next }: Props) {
  const { meta, content, slug } = work;
  const lede = meta.lede?.length ? meta.lede : meta.summary ? [meta.summary] : [];

  return (
    <>
      <ProjectKeyboardNav basePath="works" prevSlug={prev?.slug ?? null} nextSlug={next?.slug ?? null} />
      <header className="hero" />
      <main className="main-content">
        <div className="divider" />
        <section className="section hero-content-section">
          <div className="container">
            <div className="hero-content">
              <div className="project-date">{meta.date}</div>
              {meta.titleHtml ? (
                <h1
                  className="section-title animated-section-title"
                  id="animatedTitle"
                  data-title={meta.title}
                  dangerouslySetInnerHTML={{ __html: meta.titleHtml }}
                />
              ) : (
                <h1 className="section-title animated-section-title" id="animatedTitle" data-title={meta.title}>
                  {meta.title}
                </h1>
              )}
              {lede.length > 0 && (
                <div className="hero-info-description">
                  {lede.map((line, i) => (
                    <p key={i}>
                      <span className="prefix-char">+</span> {line}
                    </p>
                  ))}
                </div>
              )}
              {meta.ctas && meta.ctas.length > 0 && (
                <div className={meta.ctas.length > 1 ? 'hero__actions' : undefined}>
                  {meta.ctas.map((cta) => (
                    <a
                      key={cta.href + cta.label}
                      href={cta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-cta"
                    >
                      {cta.label}
                      <span className="btn-cta__icon-wrap">
                        <CtaArrowIcon />
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="divider" />
        <section className="section project-details-section">
          <div className="container">
            <MarkdownBody content={content} />
            {slug === '11kitiz-s2' && (
              <KittiesDetailLottie jsonPath="/images/works/11kitiz-s2/cat_heart.json" />
            )}
          </div>
        </section>
      </main>

      <ProjectNavLinks
        basePath="works"
        prev={
          prev
            ? { slug: prev.slug, title: prev.meta.title, titleHtml: prev.meta.titleHtml }
            : null
        }
        next={
          next
            ? { slug: next.slug, title: next.meta.title, titleHtml: next.meta.titleHtml }
            : null
        }
      />
    </>
  );
}
