'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  basePath: 'works' | 'labs';
  prevSlug: string | null;
  nextSlug: string | null;
};

export function ProjectKeyboardNav({ basePath, prevSlug, nextSlug }: Props) {
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      const el = e.target as HTMLElement | null;
      if (el?.closest('input, textarea, select, [contenteditable="true"]')) return;

      if (e.key === 'ArrowLeft' && prevSlug) {
        e.preventDefault();
        router.push(`/${basePath}/${prevSlug}/`);
      } else if (e.key === 'ArrowRight' && nextSlug) {
        e.preventDefault();
        router.push(`/${basePath}/${nextSlug}/`);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [basePath, prevSlug, nextSlug, router]);

  return null;
}
