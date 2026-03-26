# Vercel デプロイ手順

作成日: 2026-03-24

---

## 事前確認

- [ ] `npm run build` がエラーなく完了する
- [ ] ローカル（`npm run dev`）で全ページの表示を確認済み

---

## Step 1: master を GitHub に push

`feature/nextjs-migration` は master にマージ済み。以下を実行：

```bash
git push origin master
```

---

## Step 2: Vercel アカウント作成

1. https://vercel.com にアクセス
2. 「Sign Up」→「**Continue with GitHub**」でGitHubアカウントと連携

---

## Step 3: プロジェクトのインポート

1. Vercel ダッシュボードで「**Add New → Project**」
2. GitHubリポジトリ一覧から `portfolio_1` を選択して「**Import**」
3. 設定画面で以下を入力：

| 項目 | 設定値 |
|---|---|
| **Root Directory** | `hasuda-portfolio` |
| Framework Preset | Next.js（自動検出） |
| Build Command | `npm run build`（デフォルト） |

> ⚠️ **Root Directory の `hasuda-portfolio` 設定を忘れずに。**
> リポジトリのルートではなくサブディレクトリがNext.jsプロジェクトのため、ここが空欄だとビルドが失敗する。

4. 「**Deploy**」をクリック
5. デプロイ完了後、発行された `xxx.vercel.app` のURLで全ページを確認する

---

## Step 4: カスタムドメインの設定

> ⚠️ **Step 3 の動作確認が完了してから行うこと。この操作の完了後、公開サイトが GitHub Pages から Vercel に切り替わる。**

### Vercel 側

1. プロジェクトの「**Settings → Domains**」
2. `hasuda.org` を追加
3. 画面に表示される DNS レコード（A レコードまたは CNAME レコード）を控える

### ドメインのDNS設定側

ドメインを管理しているレジストラ（お名前.com 等）の管理画面で：

1. 既存の GitHub Pages 向けレコードを削除
2. Vercel が指定したレコードに書き換える

> DNS の変更反映には最大 48 時間かかる場合がある。

---

## Step 5: 移行完了後の後片付け

Vercel での動作が安定したら：

1. `master` から旧 HTML ファイル（`index.html`, `about.html` 等）を削除
2. GitHub の Settings → Pages から GitHub Pages を無効化

---

## トラブルシューティング

| 症状 | 確認箇所 |
|---|---|
| Vercel ビルドが失敗する | Root Directory が `hasuda-portfolio` になっているか確認 |
| 画像が表示されない | `public/images/` 以下のファイルが push されているか確認 |
| ドメインが反映されない | DNS 変更から 48 時間待つ。Vercel の Domains 画面でステータス確認 |
| 旧 URL（`.html` 付き）が動かない | `next.config.ts` のリダイレクト設定が含まれているか確認 |
