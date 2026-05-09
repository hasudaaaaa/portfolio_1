# トップページ拡充 実装計画

作成日: 2026-05-10

## 目的

現在のトップページはキービジュアルと簡単なプロフィールカードのみで、作品やプロフィール情報を見るには下層ページへ移動する必要がある。キービジュアル下にトップページ用のコンテンツを追加し、作品・人物・制作姿勢が自然に伝わる入口にする。

## 参照・前提

- 既存計画: `docs/new-index-plan.md`
- メイン実装対象: `hasuda-portfolio/app/page.tsx`, `hasuda-portfolio/app/page.module.css`
- 既存スタイル参照: `hasuda-portfolio/app/globals.css`, `hasuda-portfolio/app/about/page.module.css`
- 作品データ: `hasuda-portfolio/content/artworks/*.md`
- サムネイル画像: `thumbnailPath` を優先して使用する
- 参考サイト: https://ajalaca.com/

## 実装方針

1. トップページは既存のキービジュアルを維持し、その下に複数セクションを追加する。
2. 作品紹介は `getAllArtworks()` から取得し、最新作品を中心にピックアップする。
3. 作品の横流し表現は、JavaScript依存の重いスクロール制御ではなく、CSSアニメーションによる横方向の無限レーンを基本にする。
4. アニメーション対象は作品サムネイルのカード列にし、ユーザーがホバーしたときは動きを止めてクリックしやすくする。
5. `prefers-reduced-motion` では横流しアニメーションを止め、横スクロール可能な静的レーンとして表示する。
6. Aboutページの内容から、プロフィール概要・制作ツール・制作フローの要約をトップに統合する。
7. 詳細なプロフィール、作品一覧、制作工程は既存ページへのリンクで誘導する。

## 追加予定セクション

### 1. Featured Artworks

- キービジュアル直下に配置する作品レーン。
- `getAllArtworks().slice(0, 8)` 程度を候補にする。
- サムネイル、タイトル、日付を表示する。
- レーン用に同じ配列を2回描画し、CSSで横方向に流す。
- 各カードは `/artworks/[id]` にリンクする。

### 2. About Preview

- Aboutページ冒頭の自己紹介文を短く再構成する。
- アイコン画像、名前、短い説明、SNS/プロフィール導線を配置する。
- 既存の `.button-type1`, `.glass-container-type2`, `W3` を活用する。

### 3. Process Preview

- 3DCGで背景を作り、ペイントソフトで仕上げる制作フローを短く見せる。
- Aboutページの制作工程画像を数点だけ使い、詳細は `/about#making` へ誘導する。

## ファイル変更予定

- `docs/plan-new-index-implementation.md`
  - この実装計画。
- `hasuda-portfolio/app/page.tsx`
  - 作品データ取得、追加セクションのマークアップ。
- `hasuda-portfolio/app/page.module.css`
  - トップページ追加セクション、作品横流し、レスポンシブ調整。

## 検証

1. `npm run lint`
2. 必要に応じて `npm run build`
3. ローカル開発サーバーでトップページを確認
4. PC幅・スマホ幅で、文字のはみ出し、画像比率、横流しの見え方を確認

## ユーザー確認事項

- 新規ブランチ `future` を作成して作業する必要がある。
- 作品ピックアップは、まず最新順の自動選出で進める。特定作品を固定したい場合は後から差し替える。
- 参考サイトの横スクロール演出は、完全再現ではなく、このサイトに合う軽量な横流し表現として実装する。
