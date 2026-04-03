'use client';

import { useEffect } from 'react';

export function ProjectBodyClass() {
  useEffect(() => {
    document.body.classList.add('project-detail-page');
    return () => {
      document.body.classList.remove('project-detail-page');
    };
  }, []);
  return null;
}
