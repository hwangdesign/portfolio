import { ProjectBodyClass } from '@/components/ProjectBodyClass';

export default function LabSlugLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProjectBodyClass />
      {children}
    </>
  );
}
