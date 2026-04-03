import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { LabFrontmatter } from './types';

const LABS_DIR = path.join(process.cwd(), 'content', 'labs');

export function getAllLabSlugs(): string[] {
  if (!fs.existsSync(LABS_DIR)) return [];
  return fs
    .readdirSync(LABS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''));
}

export type LabEntry = {
  meta: LabFrontmatter;
  content: string;
  slug: string;
};

export function getLabBySlug(slug: string): LabEntry | null {
  const full = path.join(LABS_DIR, `${slug}.md`);
  if (!fs.existsSync(full)) return null;
  const raw = fs.readFileSync(full, 'utf8');
  const { data, content } = matter(raw);
  const meta = data as LabFrontmatter;
  if (!meta.slug) meta.slug = slug;
  return { meta, content, slug: meta.slug };
}

export function getAllLabs(): LabEntry[] {
  return getAllLabSlugs()
    .map((slug) => getLabBySlug(slug))
    .filter((l): l is LabEntry => l !== null && l.meta.published !== false)
    .sort((a, b) => {
      const oa = a.meta.order ?? 9999;
      const ob = b.meta.order ?? 9999;
      if (oa !== ob) return oa - ob;
      return (b.meta.date || '').localeCompare(a.meta.date || '');
    });
}

export function getLabsForHome(): LabEntry[] {
  return getAllLabs().filter((l) => l.meta.showOnHome === true);
}

export function getAdjacentLabs(slug: string): {
  prev: LabEntry | null;
  next: LabEntry | null;
} {
  const all = getAllLabs();
  const idx = all.findIndex((l) => l.slug === slug);
  if (idx < 0) return { prev: null, next: null };
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  };
}

export function resolveLabThumbnail(meta: LabFrontmatter): string {
  if (meta.thumbnail) return meta.thumbnail;
  return `/images/labs/${meta.slug}/thumbnail.png`;
}
