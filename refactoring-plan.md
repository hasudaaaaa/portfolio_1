# 現状
生のHTML, CSS, Javascriptで構成され、GitHub Pagesで公開されている。サイト更新と保守作業の工数削減のためにコンポーネント設計に移行し、CMSを導入することを目的としている

---

# Webサイト構成まとめ

## 目的
- 既存のHTML/CSS/JSサイトを現代的な構成に移行
- コンテンツ管理の仕組みを導入

---
## 技術スタック
| 項目 | 採用技術 |
|------|----------|
| フレームワーク | Next.js |
| スタイリング | CSS Modules |
| CMS | Git-based（Markdownファイル） |
| 画像最適化 | Next.js `<Image>` コンポーネント |
| デプロイ | Vercel（無料枠） |

※スタイリングはTailwindCSS不使用のためCSS Modulesを想定。他に希望があれば変更可。


## 画像ワークフロー
- push前に圧縮スクリプト（sharp製）を実行する習慣をつける
- 元画像は `/public/images/originals/` に置き `.gitignore` で除外

---

## デザイン → 実装のフロー
1. Figmaでデザインを作成
2. PNG書き出し → Claude Codeに渡す
3. 細かい値（色・サイズ）はFigmaのDev Modeで補足

---

## Claude Codeでの作業手順
```
1. 既存リポジトリをClaude Codeで開く
2. 「まず構成を分析して報告して」と投げる
3. コンポーネント設計案を確認してからOKを出す
4. 1ページずつFigmaのPNGを渡しながら実装
5. Vercelにデプロ
```