#!/usr/bin/env node
/**
 * PNG 이미지 압축 스크립트
 * sharp로 품질 유지하며 용량 절감
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

async function optimizePng(filePath) {
  try {
    const sharp = (await import('sharp')).default;
    const inputBuffer = fs.readFileSync(filePath);
    const originalSize = inputBuffer.length;
    
    const info = await sharp(inputBuffer).metadata();
    const { width, height } = info;
    
    // 썸네일은 더 강하게 압축, 디테일 이미지는 품질 유지
    const isThumbnail = path.basename(filePath).startsWith('thumbnail');
    const quality = isThumbnail ? 80 : 90;
    
    const outputBuffer = await sharp(inputBuffer)
      .png({ quality, compressionLevel: 9, adaptiveFiltering: true })
      .toBuffer();
    
    const newSize = outputBuffer.length;
    const saved = ((1 - newSize / originalSize) * 100).toFixed(1);
    
    if (newSize < originalSize) {
      fs.writeFileSync(filePath, outputBuffer);
      console.log(`${path.relative(rootDir, filePath)}: ${(originalSize/1024).toFixed(0)}KB → ${(newSize/1024).toFixed(0)}KB (-${saved}%)`);
      return { saved: originalSize - newSize };
    }
    return { saved: 0 };
  } catch (e) {
    console.warn('Skip', filePath, e.message);
    return { saved: 0 };
  }
}

async function main() {
  const dirs = [
    'works/images/MartPlus',
    'works/images/11Kitties',
    'works/images/ootd',
    'works/images/DesignSystem',
    'works/images/ooah',
    'works/images/eXperience',
    'labs/images/InteractiveAnalogClock',
  ];
  
  let totalSaved = 0;
  for (const dir of dirs) {
    const fullPath = path.join(rootDir, dir);
    if (!fs.existsSync(fullPath)) continue;
    
    const files = fs.readdirSync(fullPath).filter(f => f.endsWith('.png'));
    for (const file of files) {
      const result = await optimizePng(path.join(fullPath, file));
      totalSaved += result.saved;
    }
  }
  
  console.log('\n총 절감:', (totalSaved / 1024 / 1024).toFixed(2), 'MB');
}

main().catch(console.error);
