# 検討事項: アートワーク詳細ページの OGP 画像動的生成

作成日: 2026-03-25

---

## 現状

- ~~サイト全体で固定の OGP 画像（`/images/og-image.webp`）を使用~~
- **2026-03-26 対応済み**: 各ページが `openGraph` を上書きして `images` を消していた問題を修正
  - `lib/metadata.ts` を新規作成し、`OG_IMAGE_URL` と `defaultOpenGraph` を一元管理
  - 全 `page.tsx` で `defaultOpenGraph` をスプレッドするよう更新
  - OGP 画像の変更は `lib/metadata.ts` の `OG_IMAGE_URL` 1行だけで全ページに反映される
- アートワーク詳細ページは引き続き固定画像。SNS シェア時に作品ごとの画像が表示されない（未対応）

---

## 方針（決定済み）

**Next.js 組み込みの `next/og`（`ImageResponse`）を使い、作品画像を自動トリミングして OGP 画像を生成する。**

- `app/artworks/[id]/opengraph-image.tsx` を新規作成するだけで、そのページの `og:image` が自動的に切り替わる（Next.js App Router のファイル規約）
- sharp 等の追加ライブラリは不要
- 縦長イラストを `object-fit: cover` + `object-position: center top` で 1200×630 にトリミング
- 画像は `public/` からバイナリ読み込み → base64 変換するため、絶対 URL 不要（ローカル・Vercel どちらでも動作）
- `generateStaticParams` と連携し、ビルド時に全作品分を静的生成

残り変更対象ファイル:

| ファイル | 変更内容 | 状態 |
|---|---|---|
| `lib/metadata.ts` | 新規作成（`OG_IMAGE_URL` / `defaultOpenGraph` の一元管理） | ✅ 完了 |
| `app/layout.tsx` | `defaultOpenGraph` / `OG_IMAGE_URL` をインポートして使用 | ✅ 完了 |
| `app/**/page.tsx` | 全ページで `defaultOpenGraph` をスプレッド | ✅ 完了 |
| `app/layout.tsx` | `metadataBase` を追加 | ✅ 完了 |
| `app/artworks/[id]/opengraph-image.tsx` | 新規作成（OGP 画像生成ルート） | ✅ 完了 |
| `app/artworks/[id]/page.tsx` | `generateMetadata` に `twitter.images` を追記 | ✅ 完了 |

---

## 実装前に検討すべき事項

### 1. トリミング位置をどうするか

デフォルトは `object-position: center top`（横中央・縦上部優先）。

- イラストのキャラクターや重要な要素が中央より下にある作品では、顔や主題が切れる可能性がある
- **選択肢 A**: デフォルト設定のまま受け入れる（シンプルだが作品によっては不自然なトリミングになる）
- **選択肢 B**: 後から Markdown の frontmatter に `ogPosition` フィールドを追加し、作品ごとに調整できるようにする

→ **一旦選択肢Aで実装。問題があれば修正する。**

### 2. imagePath と thumbnailPath どちらを使うか

- `imagePath`（メイン画像）: 高解像度だが縦長。トリミングの自由度が高い
- `thumbnailPath`（サムネイル）: すでに正方形に近い形でクロップ済みの可能性あり。ファイルサイズが小さい

→ メイン画像（`imagePath`）

---

## 実装タイミング

Vercel デプロイ（Phase 8）完了後、または本番 URL が確定してから実装・検証するのが効率的。
ローカルでの `npm run build && npm run start` でも事前確認は可能。
