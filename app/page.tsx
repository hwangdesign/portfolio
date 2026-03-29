import Link from 'next/link';
import { getAllProjectsMeta } from '@/lib/projects';

export default function HomePage() {
  const projects = getAllProjectsMeta();

  return (
    <main className="main-content">
      <div className="divider" />
      <section id="about" className="section">
        <div className="container">
          <div className="hero-content">
            <h1 className="section-title">Creative Director</h1>
            <div className="hero-info-description">
              <p>
                <span className="prefix-char">+</span> 이름 : 황선윤
              </p>
              <p>
                <span className="prefix-char">+</span> 이메일 :{' '}
                <a href="mailto:hwangdesign@gmail.com">hwangdesign@gmail.com</a>
              </p>
            </div>
            <a
              href="https://brunch.co.kr/@hwangdesign"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cta"
            >
              BRUNCH
            </a>{' '}
            <a
              href="https://www.linkedin.com/in/hwangdesign/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cta"
            >
              LINKEDIN
            </a>
          </div>
        </div>
      </section>

      <div className="divider" />
      <section id="works" className="section portfolio-section">
        <div className="container">
          <div className="portfolio-header">
            <h2 className="section-title">Works</h2>
          </div>
          <div className="portfolio-grid">
            {projects.map((p) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}/`}
                className="portfolio-item"
                data-date={p.date.slice(0, 7).replace('-', '/')}
              >
                <div className="portfolio-thumbnail">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.thumbnail || '/works/images/MartPlus/thumbnail.png'}
                    alt={p.title}
                    loading="lazy"
                  />
                </div>
                <div className="portfolio-info">
                  <div className="portfolio-title-wrapper">
                    <h3 className="portfolio-title section-title">{p.title}</h3>
                    <span className="portfolio-date">
                      ({p.date.slice(0, 4)}/{p.date.slice(5, 7)})
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
