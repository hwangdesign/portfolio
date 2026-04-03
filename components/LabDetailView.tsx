import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { LabEntry } from '@/lib/labs';
import { ProjectNavLinks } from '@/components/ProjectNavLinks';
import { ProjectKeyboardNav } from '@/components/ProjectKeyboardNav';
import { CtaArrowIcon } from '@/components/CtaArrowIcon';

const MarkdownBody = dynamic(() =>
  import('@/components/MarkdownBody').then((m) => ({ default: m.MarkdownBody }))
);

type Props = {
  lab: LabEntry;
  prev: LabEntry | null;
  next: LabEntry | null;
};

export function LabDetailView({ lab, prev, next }: Props) {
  const { meta, content } = lab;
  const lede = meta.lede?.length ? meta.lede : meta.summary ? [meta.summary] : [];

  return (
    <>
      <ProjectKeyboardNav basePath="labs" prevSlug={prev?.slug ?? null} nextSlug={next?.slug ?? null} />
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
              {meta.demoUrl &&
                (meta.demoUrl.startsWith('/') ? (
                  <Link href={meta.demoUrl} className="resume-btn">
                    SITE
                  </Link>
                ) : (
                  <a href={meta.demoUrl} target="_blank" rel="noopener noreferrer" className="resume-btn">
                    SITE
                  </a>
                ))}
              {meta.repoUrl && (
                <a href={meta.repoUrl} target="_blank" rel="noopener noreferrer" className="resume-btn">
                  REPO
                </a>
              )}
              {meta.ctas && meta.ctas.length > 0 && (
                <div className={meta.ctas.length > 1 ? 'hero__actions' : undefined}>
                  {meta.ctas.map((cta) =>
                    cta.href.startsWith('/') ? (
                      <Link key={cta.href + cta.label} href={cta.href} className="btn-cta">
                        {cta.label}
                        <span className="btn-cta__icon-wrap">
                          <CtaArrowIcon />
                        </span>
                      </Link>
                    ) : (
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
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="divider" />
        <section className="section project-details-section">
          <div className="container">
            <MarkdownBody content={content} />
          </div>
        </section>
      </main>

      <ProjectNavLinks
        basePath="labs"
        prev={prev ? { slug: prev.slug, title: prev.meta.title, titleHtml: prev.meta.titleHtml } : null}
        next={next ? { slug: next.slug, title: next.meta.title, titleHtml: next.meta.titleHtml } : null}
      />
    </>
  );
}
