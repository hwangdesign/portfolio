import { getHomeConfig } from '@/lib/site';
import { getWorksForHome } from '@/lib/works';
import { getLabsForHome } from '@/lib/labs';
import { HomePageClient } from '@/components/HomePageClient';

export default function HomePage() {
  const home = getHomeConfig();
  const works = getWorksForHome();
  const labs = getLabsForHome();
  return <HomePageClient home={home} works={works} labs={labs} />;
}
