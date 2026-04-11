# SNSアイコン インラインSVGコンポーネント化 実装計画

## 背景・目的

現在、Footer と About ページの SNS アイコン（Twitter/X, Pixiv, Bluesky）は
`<Image src="...svg">` で読み込まれており、CSS から `fill` / `stroke` を直接操作できない。

About ページでは `filter: brightness(0.1)` という回避策で白SVGを黒表示させているが、
これは意図が不透明で保守性が低い。

各SVGをインラインSVGコンポーネントとして切り出すことで、
CSS（または props）から `fill` / `stroke` を自由に制御できるようにする。

---

## 現状の問題点

| ファイル | 問題 |
|---|---|
| `public/images/icons/brand-twitter1.svg` | `stroke: #fff` がハードコード |
| `public/images/icons/pixiv.svg` | `fill: #fff` がハードコード |
| `public/images/icons/brand-bluesky.svg` | `stroke: #fff` がハードコード |
| `app/about/page.module.css` | `filter: brightness(0.1)` でSVGの白色を上書きする回避策 |
| `components/Footer.tsx` | `<Image>` 経由のため CSS が SVG 内部に届かない |
| `app/about/page.tsx` | 同上 |

---

## 実装方針

### ① SVGコンポーネントの作成（新規3ファイル）

`components/icons/` ディレクトリを作成し、各SVGをReactコンポーネントとして定義する。

```
components/
  icons/
    TwitterIcon.tsx
    PixivIcon.tsx
    BlueskyIcon.tsx
```

#### コンポーネントの設計

- `fill` と `stroke` を props で受け取る
- デフォルト値は `currentColor`（CSS の `color` プロパティに連動させるため）
- `width` / `height` も props で受け取る（デフォルト 32）

```tsx
// 例: components/icons/TwitterIcon.tsx
type Props = {
  stroke?: string;
  width?: number;
  height?: number;
  className?: string;
};

export function TwitterIcon({ stroke = "currentColor", width = 32, height = 32, className }: Props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={width} height={height} className={className}>
      <path fill="none" d="M0,0h24v24H0V0Z"/>
      <path
        fill="none"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M22,4c-1,.5-2,.7-3,1-1.1-1.3-2.8-1.3-4.4-.7s-2.6,2.1-2.6,3.7v1c-3.2,0-6.1-1.4-8-4,0,0-4.2,7.4,4,11-1.9,1.2-3.7,2.1-6,2,3.3,1.8,6.9,2.4,10,1.5,3.6-1,6.5-3.7,7.7-7.7.3-1.2.5-2.5.5-3.8,0-.2,1.5-2.8,1.8-4h0Z"
      />
    </svg>
  );
}
```

```tsx
// 例: components/icons/PixivIcon.tsx
export function PixivIcon({ fill = "currentColor", width = 32, height = 32, className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={width} height={height} className={className}>
      <path fill={fill} d="M4.9,0C2.2,0,0,2.2,0,4.9..."/>
    </svg>
  );
}
```

```tsx
// 例: components/icons/BlueskyIcon.tsx
// TwitterIcon と同じ構造（stroke のみ使用）
```

---

### ② Footer.tsx の修正

**変更前:**
```tsx
import Image from "next/image";
...
<Image src="/images/icons/brand-twitter1.svg" alt="twitter" width={32} height={32} className={styles.snsIcon} />
```

**変更後:**
```tsx
import { TwitterIcon } from "@/components/icons/TwitterIcon";
import { PixivIcon } from "@/components/icons/PixivIcon";
import { BlueskyIcon } from "@/components/icons/BlueskyIcon";
...
<TwitterIcon className={styles.snsIcon} />
<PixivIcon className={styles.snsIcon} />
<BlueskyIcon className={styles.snsIcon} />
```

`Footer.module.css` の `.snsIcon` で `color` を設定することで `currentColor` が伝播する。

```css
/* Footer.module.css */
.snsIcon {
  width: 2rem;
  height: 2rem;
  color: #ffffff;          /* currentColor としてfill/strokeに反映 */
  transition: all 0.3s ease;
}
.snsIcon:hover {
  color: rgba(255,255,255,0.7);
}
```

---

### ③ about/page.tsx の修正

**変更前:**
```tsx
<Image src="/images/icons/brand-twitter1.svg" alt="twitter" width={32} height={32} className={styles.snsIcon} />
```

**変更後:**
```tsx
<TwitterIcon className={styles.snsIcon} />
```

`about/page.module.css` の `.snsIcon` から `filter: brightness()` の回避策を削除し、
`color` プロパティで素直に制御する。

```css
/* about/page.module.css（変更後） */
.snsIcon {
  width: 2rem;
  height: 2rem;
  color: #1a1a1a;          /* ライトモード: 暗い色 */
  transition: all 0.3s ease;
}
.snsIcon:hover {
  color: #555555;
}
@media (prefers-color-scheme: dark) {
  .snsIcon { color: #ffffff; }
  .snsIcon:hover { color: rgba(255,255,255,0.6); }
}
```

---

## 変更ファイル一覧

| 操作 | ファイル | 内容 |
|---|---|---|
| 新規作成 | `components/icons/TwitterIcon.tsx` | Twitter/Xアイコン |
| 新規作成 | `components/icons/PixivIcon.tsx` | Pixivアイコン |
| 新規作成 | `components/icons/BlueskyIcon.tsx` | Blueskyアイコン |
| 修正 | `components/Footer.tsx` | `<Image>` → コンポーネントに差し替え |
| 修正 | `components/Footer.module.css` | `color` プロパティで色制御 |
| 修正 | `app/about/page.tsx` | `<Image>` → コンポーネントに差し替え |
| 修正 | `app/about/page.module.css` | `filter` 回避策を削除、`color` で制御 |
| 変更なし | `public/images/icons/*.svg` | 元ファイルは残す（他で使われている可能性あり） |

---

## 注意事項

- Pixiv アイコンは `fill` のみ使用（stroke なし）。TwitterとBlueskyは `stroke` のみ（fill は none）。
  それぞれ props 名を正確に合わせること。
- `<Image>` はNext.jsの最適化機能（WebP変換・遅延読み込み等）を提供するが、
  SVGアイコン（数十バイト）ではその恩恵がないため、インライン化しても問題なし。
- 元のSVGファイルは削除せず残しておく。将来的に `<img>` として使いたい場面があるかもしれないため。
