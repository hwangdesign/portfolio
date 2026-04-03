import Link from 'next/link';

type NavItem = { slug: string; title: string; titleHtml?: string };

type Props = {
  basePath: 'works' | 'labs';
  prev: NavItem | null;
  next: NavItem | null;
};

function NavTitle({ item }: { item: NavItem }) {
  if (item.titleHtml) {
    return <span dangerouslySetInnerHTML={{ __html: item.titleHtml }} />;
  }
  return <>{item.title}</>;
}

export function ProjectNavLinks({ basePath, prev, next }: Props) {
  const labelPrev = '←←';
  const labelNext = '→→';
  const empty = '-';

  return (
    <div className="project-navigation-wrapper">
      <div className="container">
        <nav className="project-navigation">
          {prev ? (
            <Link href={`/${basePath}/${prev.slug}/`} className="project-nav-link prev">
              <span className="project-nav-label">{labelPrev}</span>
              <span className="project-nav-title">
                <NavTitle item={prev} />
              </span>
            </Link>
          ) : (
            <span className="project-nav-link disabled prev">
              <span className="project-nav-label">{labelPrev}</span>
              <span className="project-nav-title">{empty}</span>
            </span>
          )}
          {next ? (
            <Link href={`/${basePath}/${next.slug}/`} className="project-nav-link next">
              <span className="project-nav-label">{labelNext}</span>
              <span className="project-nav-title">
                <NavTitle item={next} />
              </span>
            </Link>
          ) : (
            <span className="project-nav-link disabled next">
              <span className="project-nav-label">{labelNext}</span>
              <span className="project-nav-title">{empty}</span>
            </span>
          )}
        </nav>
      </div>
    </div>
  );
}
