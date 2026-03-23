# Next.js 移行 実装計画

作成日: 2026-03-23

---

## 移行対象の整理

### 現在の構成 → Next.js 後の対応表

| 現在のファイル | 移行先 | 備考 |
|---|---|---|
| `index.html` | `app/page.tsx` | |
| `about.html` | `app/about/page.tsx` | |
| `artworks/artworks.html` | `app/artworks/page.tsx` | |
| `artworks/No-XXX.html`（7ファイル） | `app/artworks/[id]/page.tsx` | 動的ルート1本に集約 |
| `blogs/blogs.html` | `app/blogs/page.tsx` | |
| `ComingSoon.html` | `app/coming-soon/page.tsx` | |
| `commonHTML/footer.html` | `components/Footer.tsx` | |
| `commonHTML/menu-overlay.html` | `components/MenuOverlay.tsx` | |
| `commonHTML/rollup.html` | `components/ScrollToTop.tsx` | |
| `css/common.css` | `app/globals.css` + `components/Layout.module.css` | |
| `css/style.css` | `app/page.module.css` | |
| `css/about.css` | `app/about/page.module.css` | |
| `css/artwork-detail.css` | `app/artworks/[id]/page.module.css` | |
| `css/artworks.css` | `app/artworks/page.module.css` | |
| `css/blogs.css` | `app/blogs/page.module.css` | |
| `artworks/artworks.json` | `content/artworks/No-XXX.md`（×7） | Markdownに変換 |
| `blogs/blogs.json` | `content/blogs/blogs.json` | 外部URLのためJSONのまま保持 |

---

## ディレクトリ構成（移行後）

```
hasuda-portfolio/
├── app/
│   ├── layout.tsx              # 共通レイアウト（Header, Footer, MenuOverlay, ScrollToTop）
│   ├── globals.css             # 現: common.css を移植
│   ├── page.tsx                # トップページ
│   ├── page.module.css
│   ├── about/
│   │   ├── page.tsx
│   │   └── page.module.css
│   ├── artworks/
│   │   ├── page.tsx            # 一覧ページ
│   │   ├── page.module.css
│   │   └── [id]/
│   │       ├── page.tsx        # 詳細ページ（動的ルート）
│   │       └── page.module.css
│   ├── blogs/
│   │   ├── page.tsx
│   │   └── page.module.css
│   └── coming-soon/
│       └── page.tsx
├── components/
│   ├── Layout.tsx              # Header + children + Footer をまとめるラッパー
│   ├── Layout.module.css
│   ├── Header.tsx
│   ├── Header.module.css
│   ├── Footer.tsx
│   ├── Footer.module.css
│   ├── MenuOverlay.tsx
│   ├── MenuOverlay.module.css
│   ├── ScrollToTop.tsx
│   ├── ScrollToTop.module.css
│   ├── ArtworkCard.tsx         # 一覧ページのサムネイルカード
│   ├── ArtworkCard.module.css
│   ├── BlogCard.tsx
│   └── BlogCard.module.css
├── content/
│   ├── artworks/
│   │   ├── No-089.md
│   │   ├── No-094.md
│   │   ├── No-101.md
│   │   ├── No-102.md
│   │   ├── No-104.md
│   │   ├── No-107.md
│   │   └── No-109.md
│   └── blogs/
│       └── blogs.json          # 外部URLのためJSONのまま
├── lib/
│   ├── getArtworks.ts          # Markdownを読み込むユーティリティ
│   └── getBlogs.ts
├── public/
│   └── images/                 # 現状と同じ構造を維持
│       ├── artworks/
│       ├── blogs/
│       ├── icons/
│       └── index/
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## Markdownのデータ形式

### `content/artworks/No-109.md` の例

```markdown
---
number: "109"
title: "某朝"
date: "2025年3月9日"
imagePath: "/images/artworks/No-109/109-1s.webp"
thumbnailPath: "/images/artworks/No-109/109-1s-thumb.jpg"
twitterUrl: "https://twitter.com/hasudaaaaaaa/status/1898744597108678782"
---

V睡から目覚めて現実に復帰しなければならなくなってしまった瞬間……みたいな。
私はV睡したことないですが。
```

**フロントマター項目：**
- `number` — ページIDに使用（`/artworks/No-109`）
- `title` — ページタイトル・OGP用
- `date` — 表示用の日付文字列
- `imagePath` — メイン画像パス
- `thumbnailPath` — 一覧サムネイルパス
- `twitterUrl` — Twitter埋め込みURL（任意）

本文（フロントマター以下）がコメントテキストになる。

---

## 実装フェーズ

### Phase 1: Next.js プロジェクトのセットアップ

```bash
npx create-next-app@latest hasuda-portfolio \
  --typescript \
  --app \
  --no-tailwind \
  --src-dir=false \
  --import-alias="@/*"

cd hasuda-portfolio
npm install gray-matter remark remark-html
```

**この段階でやること：**
- `next.config.ts` に画像ドメイン設定（`hasuda.org` からのOG画像など）を追加
- `tsconfig.json` のパスエイリアスを確認
- `public/images/` に現在の画像フォルダをまるごとコピー

---

### Phase 2: 共通コンポーネントの実装

**実装順序：** Layout → Header → MenuOverlay → Footer → ScrollToTop

**`app/layout.tsx`（骨格）**
```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <Header />
        <MenuOverlay />
        {children}
        <ScrollToTop />
        <Footer />
      </body>
    </html>
  );
}
```

**移植のポイント：**
- `common-element-loader.js`（fetch で HTML 注入）→ 不要になる。React コンポーネントで直接レンダリング
- `humburber-menu.js`（クリックでクラス切り替え）→ `MenuOverlay.tsx` 内で `useState` に置き換え
- `modal-window.js` → `app/artworks/[id]/page.tsx` 内で `useState` に置き換え
- Google Analytics → `app/layout.tsx` に `next/script` で設定
- Adobe Typekit → `app/layout.tsx` の `<head>` に `next/script` で設定

**Google Analytics の設定例：**
```tsx
// app/layout.tsx
import Script from 'next/script';

// <head> 内または <body> 内に追加
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-YKMB6PTS6F"
  strategy="afterInteractive"
/>
<Script id="ga-init" strategy="afterInteractive">{`
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-YKMB6PTS6F');
`}</Script>
```

---

### Phase 3: 静的ページの移行

以下のページを順番に実装する。デザインは Figma PNG を渡して Claude Code に依頼。

1. `app/page.tsx`（トップ）
2. `app/about/page.tsx`
3. `app/coming-soon/page.tsx`

**CSS の移植方針：**
- セレクタを変更する必要はほぼなし
- ファイルを `.module.css` にリネームし、`className={styles.xxx}` に書き換えるだけ
- グローバルに当てていたスタイル（リセット、変数、共通クラス）は `globals.css` に残す

---

### Phase 4: Markdown コンテンツの準備

既存の 7 つのアートワーク HTML から Markdown を手動で作成する。

**作業内容（7ページ分）：**
1. 各 HTML から「コメントテキスト」「Twitter URL」を抜き出す
2. `content/artworks/No-XXX.md` を作成
3. `artworks.json` の `imagePath`, `thumbnailPath`, `title`, `date` をフロントマターに移す

**`lib/getArtworks.ts` の実装：**
```ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const contentDir = path.join(process.cwd(), 'content/artworks');

export function getAllArtworkIds() {
  return fs.readdirSync(contentDir).map(f => f.replace(/\.md$/, ''));
}

export async function getArtwork(id: string) {
  const filePath = path.join(contentDir, `${id}.md`);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const processed = await remark().use(html).process(content);
  return { ...data, contentHtml: processed.toString() };
}

export function getAllArtworks() {
  return getAllArtworkIds()
    .map(id => {
      const raw = fs.readFileSync(path.join(contentDir, `${id}.md`), 'utf-8');
      return { id, ...matter(raw).data };
    })
    .sort((a, b) => Number(b.number) - Number(a.number));
}
```

---

### Phase 5: アートワークページの実装

**`app/artworks/page.tsx`（一覧）**
- `getAllArtworks()` を呼び出してサムネイル一覧を表示
- `ArtworkCard` コンポーネントで各カードをレンダリング
- Next.js `<Image>` で `thumbnailPath` を表示

**`app/artworks/[id]/page.tsx`（詳細）**
```ts
// 静的ビルド用
export async function generateStaticParams() {
  return getAllArtworkIds().map(id => ({ id }));
}
```
- `getArtwork(id)` でデータ取得
- メイン画像 → `<Image>`
- コメント → `dangerouslySetInnerHTML={{ __html: contentHtml }}`
- Twitter 埋め込み → `twitterUrl` があれば `<blockquote>` + `next/script` で `widgets.js` 読み込み
- モーダル → `useState` で開閉管理

**URL 変化：**
- 旧: `/artworks/No-109.html`
- 新: `/artworks/No-109`

`next.config.ts` にリダイレクト設定を追加して旧 URL を引き継ぐ：
```ts
async redirects() {
  return [
    { source: '/artworks/:id.html', destination: '/artworks/:id', permanent: true },
    { source: '/ComingSoon.html', destination: '/coming-soon', permanent: true },
  ];
}
```

---

### Phase 6: ブログページの実装

ブログは外部 note.com へのリンク一覧のため、Markdown 化せず `content/blogs/blogs.json` のまま使用。

```ts
// lib/getBlogs.ts
import blogs from '@/content/blogs/blogs.json';
export function getAllBlogs() { return blogs; }
```

---

### Phase 7: 画像圧縮スクリプトの追加

```bash
npm install --save-dev sharp
```

`scripts/compress-images.ts` を作成し、`/public/images/originals/` の画像を圧縮して出力。

```json
// package.json に追加
"scripts": {
  "compress": "tsx scripts/compress-images.ts"
}
```

`.gitignore` に追加：
```
/public/images/originals/
```

---

### Phase 8: Vercel デプロイ

1. GitHub にリポジトリを push
2. [vercel.com](https://vercel.com) で「Import Git Repository」
3. フレームワーク: Next.js（自動検出）
4. ビルドコマンド: `npm run build`（デフォルト）
5. カスタムドメイン `hasuda.org` の DNS を Vercel に向け直す

**GitHub Pages から Vercel への DNS 切り替え：**
- `CNAME` レコードを `xxx.github.io` → Vercel が発行するドメインに変更
- または `A` レコードを Vercel の IP に変更

---

## 作業チェックリスト

### セットアップ
- [ ] Next.js プロジェクト作成
- [ ] 依存パッケージのインストール（`gray-matter`, `remark`, `remark-html`）
- [ ] `public/images/` に画像を移動

### 共通コンポーネント
- [ ] `Header.tsx` — ロゴ + ハンバーガーボタン
- [ ] `MenuOverlay.tsx` — ナビゲーションリンク + 開閉状態管理（useState）
- [ ] `Footer.tsx` — ロゴ + SNS リンク + コピーライト
- [ ] `ScrollToTop.tsx` — スクロール量に応じた表示/非表示

### 静的ページ
- [ ] `app/page.tsx`（トップ）
- [ ] `app/about/page.tsx`
- [ ] `app/coming-soon/page.tsx`

### アートワーク
- [ ] `content/artworks/No-089.md` 〜 `No-109.md` を作成（7ファイル）
- [ ] `lib/getArtworks.ts` を実装
- [ ] `app/artworks/page.tsx`（一覧）
- [ ] `app/artworks/[id]/page.tsx`（詳細 + モーダル）

### ブログ
- [ ] `content/blogs/blogs.json` を移動
- [ ] `app/blogs/page.tsx`

### 仕上げ
- [ ] Google Analytics を `layout.tsx` に設定
- [ ] Adobe Typekit を `layout.tsx` に設定
- [ ] OGP メタタグを各ページに設定
- [ ] 旧 URL のリダイレクト設定（`next.config.ts`）
- [ ] 画像圧縮スクリプト作成
- [ ] Vercel デプロイ・カスタムドメイン設定

---

## 実装の推奨順序

1回の作業セッションで 1 ページずつ進める。

```
Week 1: Phase 1〜2（セットアップ + 共通コンポーネント）
Week 2: Phase 3（静的ページ 3 件）
Week 3: Phase 4〜5（Markdown 作成 + アートワークページ）
Week 4: Phase 6〜8（ブログ + スクリプト + デプロイ）
```

---

## 注意事項

- **Twitter 埋め込み** — `widgets.js` は `next/script` で `strategy="lazyOnload"` にして読み込む。詳細ページにのみ適用
- **モーダルウィンドウ** — `'use client'` ディレクティブが必要（useState を使うため）
- **ハンバーガーメニュー** — 同様に `'use client'` が必要
- **`dangerouslySetInnerHTML`** — remark で生成した HTML の使用箇所のみに限定する
