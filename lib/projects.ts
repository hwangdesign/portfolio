import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { ProjectFrontmatter } from '@/types/project';

const contentDir = path.join(process.cwd(), 'content/projects');

export function getProjectSlugs(): string[] {
  if (!fs.existsSync(contentDir)) return [];
  return fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''));
}

export function getProjectBySlug(slug: string): {
  meta: ProjectFrontmatter;
  content: string;
} {
  const full = path.join(contentDir, `${slug}.md`);
  const raw = fs.readFileSync(full, 'utf8');
  const { data, content } = matter(raw);
  return { meta: data as ProjectFrontmatter, content };
}

export function getAllProjectsMeta(): ProjectFrontmatter[] {
  const slugs = getProjectSlugs();
  const items = slugs.map((slug) => getProjectBySlug(slug).meta);
  return items.sort((a, b) => b.date.localeCompare(a.date));
}
