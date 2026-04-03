export type WorkFrontmatter = {
  title: string;
  slug: string;
  date: string;
  category?: string;
  summary?: string;
  problem?: string;
  outcome?: string;
  tags?: string[];
  featured?: boolean;
  /** 정렬·이전/다음 글 순서 (낮을수록 앞) */
  order?: number;
  thumbnail?: string;
  published?: boolean;
  /** 홈 Works 그리드 노출 (기본 true) */
  showOnHome?: boolean;
  /** h1에 HTML 허용 (예: Mart<sup>Plus</sup>) */
  titleHtml?: string;
  demoUrl?: string;
  siteLabel?: string;
  /** 히어로 두 줄 요약 (+ prefix 스타일) */
  lede?: string[];
  /** SITE / BRUNCH 등 */
  ctas?: { label: string; href: string }[];
};

export type LabFrontmatter = {
  title: string;
  slug: string;
  date: string;
  category?: string;
  summary?: string;
  tags?: string[];
  order?: number;
  thumbnail?: string;
  published?: boolean;
  showOnHome?: boolean;
  demoUrl?: string;
  repoUrl?: string;
  titleHtml?: string;
  lede?: string[];
  ctas?: { label: string; href: string }[];
};
