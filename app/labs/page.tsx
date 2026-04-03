import Link from 'next/link';
import { getAllLabs } from '@/lib/labs';

export const metadata = {
  title: 'Labs — 황선윤 포트폴리오',
};

export default function LabsIndexPage() {
  const labs = getAllLabs();
  return (
    <>
      <header className="hero" />
      <main className="main-content">
        <div className="divider" />
        <section className="section">
          <div className="container">
            <h1 className="section-title animated-section-title" data-title="Labs">
              Labs
            </h1>
            <ul className="hero-info-description" style={{ listStyle: 'none', padding: 0 }}>
              {labs.map((l) => (
                <li key={l.slug} style={{ marginBottom: '0.75rem' }}>
                  <Link href={`/labs/${l.slug}/`}>
                    {l.meta.title} <span className="portfolio-date">({l.meta.date})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </>
  );
}
