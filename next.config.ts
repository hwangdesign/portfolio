import type { NextConfig } from 'next';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** 예: https://hwangdesign.pe.kr/portfolio/ 배포 시 `NEXT_PUBLIC_BASE_PATH=/portfolio npm run build` */
const basePathRaw = process.env.NEXT_PUBLIC_BASE_PATH?.trim().replace(/\/$/, '') || '';
const basePath = basePathRaw.length > 0 ? basePathRaw : undefined;

const nextConfig: NextConfig = {
  ...(basePath ? { basePath } : {}),
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
