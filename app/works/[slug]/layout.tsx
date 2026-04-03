import { ProjectBodyClass } from '@/components/ProjectBodyClass';

export default function WorkSlugLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProjectBodyClass />
      {children}
    </>
  );
}
