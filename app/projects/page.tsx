import Link from 'next/link';
import { getAllProjectsMeta } from '@/lib/projects';

export const metadata = {
  title: 'Works — 황선윤 포트폴리오',
};

export default function ProjectsIndexPage() {
  const projects = getAllProjectsMeta();

  return (
    <main className="main-content">
      <div className="divider" />
      <section className="section">
        <div className="container">
          <h1 className="section-title">Works</h1>
          <ul style={{ marginTop: '1.5rem', listStyle: 'none', padding: 0 }}>
            {projects.map((p) => (
              <li key={p.slug} style={{ marginBottom: '1rem' }}>
                <Link href={`/projects/${p.slug}/`}>{p.title}</Link>
                {p.summary ? (
                  <span style={{ opacity: 0.7, marginLeft: '0.5rem' }}>— {p.summary}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
