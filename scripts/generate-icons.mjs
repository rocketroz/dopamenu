import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public', 'icons');

// Ensure directory exists
try {
  mkdirSync(publicDir, { recursive: true });
} catch (e) {}

const svgPath = join(publicDir, 'icon.svg');
const svg = readFileSync(svgPath);

const sizes = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-maskable-192.png', size: 192 },
  { name: 'icon-maskable-512.png', size: 512 },
];

async function generateIcons() {
  for (const { name, size } of sizes) {
    await sharp(svg)
      .resize(size, size)
      .png()
      .toFile(join(publicDir, name));
    console.log(`Generated ${name}`);
  }
  console.log('All icons generated!');
}

generateIcons().catch(console.error);
