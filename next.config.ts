import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  /* 상위 디렉터리에 다른 package-lock 이 있을 때 워크스페이스 루트 고정 */
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
