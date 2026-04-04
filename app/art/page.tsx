import fs from 'fs';
import path from 'path';

export const metadata = {
  title: 'Arts — 황선윤 포트폴리오',
};

export default function ArtPage() {
  const archivePath = path.join(process.cwd(), 'content', 'art', 'archive.json');
  let items: unknown[] = [];
  if (fs.existsSync(archivePath)) {
    items = JSON.parse(fs.readFileSync(archivePath, 'utf8')) as unknown[];
  }

  return (
    <>
      <header className="hero" />
      <main className="main-content">
        <div className="divider" />
        <section className="section">
          <div className="container">
            <h1 className="section-title" data-title="Arts">
              Arts<sup>(coming soon)</sup>
            </h1>
            <p className="hero-info-description">
              <span className="prefix-char">+</span> 아카이브 데이터는 <code>content/art/archive.json</code>에서 관리해요.
            </p>
            {items.length === 0 ? (
              <p>등록된 작품이 없어요. JSON에 항목을 추가하면 여기에 표시할 수 있어요.</p>
            ) : (
              <ul>
                {(items as { title?: string; slug?: string }[]).map((it, i) => (
                  <li key={it.slug || i}>{it.title}</li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
