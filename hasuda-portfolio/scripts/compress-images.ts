/**
 * 画像圧縮スクリプト
 *
 * public/images/originals/ 内の元データを圧縮し、
 * public/images/artworks/No-XXX/ に配置する。
 *
 * 使い方:
 *   npm run compress
 *   npm run compress -- --dry-run   # 実際の書き出しを行わず確認のみ
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// ============================================================
// CONFIG — 目標サイズが決まったらここを更新する
// ============================================================

/** メイン画像（webp）の長辺ピクセル上限 */
const MAIN_MAX_PX = 2400;

/** メイン画像の WebP 品質（1–100） */
const MAIN_QUALITY = 85;

/** サムネイル（webp）の長辺ピクセル上限 */
const THUMB_MAX_PX = 400;

/** サムネイルの WebP 品質（1–100） */
const THUMB_QUALITY = 80;

// ============================================================

const ORIGINALS_DIR = path.join(process.cwd(), 'public/images/originals');
const ARTWORKS_DIR = path.join(process.cwd(), 'public/images/artworks');

const isDryRun = process.argv.includes('--dry-run');

/** ファイル名 "111-2.jpg" → { no: "111", imgNo: "2" } */
function parseFilename(filename: string): { no: string; imgNo: string } | null {
  const match = filename.match(/^(\d+)-(\d+)\.(jpg|jpeg|png|webp)$/i);
  if (!match) return null;
  return { no: match[1], imgNo: match[2] };
}

function humanSize(bytes: number): string {
  return (bytes / 1024 / 1024).toFixed(1) + ' MB';
}

async function processFile(filename: string): Promise<void> {
  const parsed = parseFilename(filename);
  if (!parsed) {
    console.warn(`[skip] ${filename} — ファイル名が "番号-連番.拡張子" の形式ではありません`);
    return;
  }

  const { no, imgNo } = parsed;
  const srcPath = path.join(ORIGINALS_DIR, filename);
  const outDir = path.join(ARTWORKS_DIR, `No-${no}`);
  const mainName = `${no}-${imgNo}s.webp`;
  const thumbName = `${no}-${imgNo}s-thumb.webp`;
  const mainPath = path.join(outDir, mainName);
  const thumbPath = path.join(outDir, thumbName);

  const srcStat = fs.statSync(srcPath);
  const meta = await sharp(srcPath).metadata();
  console.log(`\n[${filename}]  ${meta.width}x${meta.height}  (${humanSize(srcStat.size)})`);
  console.log(`  → ${path.relative(process.cwd(), mainPath)}`);
  console.log(`  → ${path.relative(process.cwd(), thumbPath)}`);

  if (isDryRun) return;

  fs.mkdirSync(outDir, { recursive: true });

  // メイン画像
  await sharp(srcPath)
    .resize({ width: MAIN_MAX_PX, height: MAIN_MAX_PX, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: MAIN_QUALITY })
    .toFile(mainPath);

  const mainStat = fs.statSync(mainPath);
  console.log(`  ✓ main   ${humanSize(mainStat.size)}`);

  // サムネイル
  await sharp(srcPath)
    .resize({ width: THUMB_MAX_PX, height: THUMB_MAX_PX, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: THUMB_QUALITY })
    .toFile(thumbPath);

  const thumbStat = fs.statSync(thumbPath);
  console.log(`  ✓ thumb  ${humanSize(thumbStat.size)}`);
}

async function main(): Promise<void> {
  if (!fs.existsSync(ORIGINALS_DIR)) {
    console.error(`originals ディレクトリが見つかりません: ${ORIGINALS_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(ORIGINALS_DIR).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
  console.log(`対象ファイル: ${files.length} 件${isDryRun ? '  [dry-run]' : ''}`);
  console.log(`設定: メイン ${MAIN_MAX_PX}px / Q${MAIN_QUALITY}  サムネイル ${THUMB_MAX_PX}px / Q${THUMB_QUALITY}`);

  for (const f of files) {
    await processFile(f);
  }

  console.log('\n完了');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
