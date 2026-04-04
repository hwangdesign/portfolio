import Link from 'next/link';
import { getAllWorks } from '@/lib/works';

export const metadata = {
  title: 'Works — 황선윤 포트폴리오',
};

export default function WorksIndexPage() {
  const works = getAllWorks();
  return (
    <>
      <header className="hero" />
      <main className="main-content">
        <div className="divider" />
        <section className="section">
          <div className="container">
            <h1 className="section-title" data-title="Works">
              Works
            </h1>
            <ul className="hero-info-description" style={{ listStyle: 'none', padding: 0 }}>
              {works.map((w) => (
                <li key={w.slug} style={{ marginBottom: '0.75rem' }}>
                  <Link href={`/works/${w.slug}/`}>
                    {w.meta.title} <span className="portfolio-date">({w.meta.date})</span>
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
