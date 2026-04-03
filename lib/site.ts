import fs from 'fs';
import path from 'path';

export type HomeSiteConfig = {
  heroTitle: string;
  name: string;
  email: string;
  links: { label: string; href: string }[];
};

export function getHomeConfig(): HomeSiteConfig {
  const p = path.join(process.cwd(), 'content', 'site', 'home.json');
  const raw = fs.readFileSync(p, 'utf8');
  return JSON.parse(raw) as HomeSiteConfig;
}
