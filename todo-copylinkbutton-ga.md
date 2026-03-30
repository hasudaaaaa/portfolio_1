# Copy Link ボタン — GA イベント送信 実装計画

## 現状確認

- `ArtworkData.id` は存在する（例: `"No-151"`）
- GAは `app/layout.tsx` でインラインスクリプトとして `gtag` をグローバル定義済み
- TypeScriptは `window.gtag` を型として認識しないため、対処が必要

---

## 実装内容

### 1. `ArtworkDetailClient.tsx` — handleCopyLink にイベント送信を追加

```ts
const handleCopyLink = async () => {
  await navigator.clipboard.writeText(window.location.href);
  (window as any).gtag?.("event", "copy_link", {
    artwork_id: artwork.id,
    artwork_title: artwork.title,
  });
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
};
```

`(window as any).gtag?.()` を使うことで型エラーを回避しつつ、
gtag が未ロードの場合も安全にスキップできる。

### 2. 変更ファイル

| ファイル | 変更内容 |
|---|---|
| `app/artworks/[id]/ArtworkDetailClient.tsx` | `handleCopyLink` に gtag 送信1行追加 |

---

## GA管理画面での確認方法

「レポート → エンゲージメント → イベント」に `copy_link` が表示される。

カスタムパラメータ（`artwork_id`, `artwork_title`）は
「管理 → カスタム定義 → カスタムディメンション」に登録すると
レポートで絞り込みができるようになる。

---

## 補足：型宣言ファイルを作る場合（任意）

`(window as any)` を使わず型安全にしたい場合は `global.d.ts` を作成：

```ts
// hasuda-portfolio/global.d.ts
declare function gtag(...args: any[]): void;
```

これで `window.gtag` ではなく `gtag(...)` と直接呼べるようになる。
ただしポートフォリオ規模なら `(window as any)` で十分。
