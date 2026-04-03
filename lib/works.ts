import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { WorkFrontmatter } from './types';

const WORKS_DIR = path.join(process.cwd(), 'content', 'works');

export function getAllWorkSlugs(): string[] {
  if (!fs.existsSync(WORKS_DIR)) return [];
  return fs
    .readdirSync(WORKS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''));
}

export type WorkEntry = {
  meta: WorkFrontmatter;
  content: string;
  slug: string;
};

export function getWorkBySlug(slug: string): WorkEntry | null {
  const full = path.join(WORKS_DIR, `${slug}.md`);
  if (!fs.existsSync(full)) return null;
  const raw = fs.readFileSync(full, 'utf8');
  const { data, content } = matter(raw);
  const meta = data as WorkFrontmatter;
  if (!meta.slug) meta.slug = slug;
  return { meta, content, slug: meta.slug };
}

export function getAllWorks(): WorkEntry[] {
  return getAllWorkSlugs()
    .map((slug) => getWorkBySlug(slug))
    .filter((w): w is WorkEntry => w !== null && w.meta.published !== false)
    .sort((a, b) => {
      const oa = a.meta.order ?? 9999;
      const ob = b.meta.order ?? 9999;
      if (oa !== ob) return oa - ob;
      return (b.meta.date || '').localeCompare(a.meta.date || '');
    });
}

/** 홈 그리드: `showOnHome: true`인 항목만 (미설정 시 노출 안 함 — 명시 운영) */
export function getWorksForHome(): WorkEntry[] {
  return getAllWorks().filter((w) => w.meta.showOnHome === true);
}

export function getAdjacentWorks(slug: string): {
  prev: WorkEntry | null;
  next: WorkEntry | null;
} {
  const all = getAllWorks();
  const idx = all.findIndex((w) => w.slug === slug);
  if (idx < 0) return { prev: null, next: null };
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  };
}

export function resolveWorkThumbnail(meta: WorkFrontmatter): string {
  if (meta.thumbnail) return meta.thumbnail;
  return `/images/works/${meta.slug}/thumbnail.png`;
}
