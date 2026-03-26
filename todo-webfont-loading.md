# 検討事項: Adobe Fonts KitをURW DIN単体に作り直してWebフォント読み込みを高速化する

作成日: 2026-03-26

---

## 現状

- Adobe Fonts KitにURW DIN（urw-din, urw-din-semi-condensed）とヒラギノ角ゴ（hiragino-kaku-gothic-pron）の2ファミリーが同居している
- 複数ファミリーが入ったKitは埋め込みコードが `<script>` 形式のみとなり、`<link>` CSS形式が使えない
- `<script>` 形式はページがインタラクティブになった後（`afterInteractive`）に実行されるため、フォント読み込みが遅れる
- 現在は `preconnect` ヒントを追加済みだが、根本的な改善には至っていない

```
現在の読み込み順（<script>方式）:
HTML表示 → ページインタラクティブ化 → TypekitスクリプトのJS読み込み
→ TypekitがCSS取得 → CSSがフォントURL指定 → ブラウザがフォントファイル取得
```

---

## 方針（検討中）

**Adobe Fonts KitをURW DIN単体で作り直し、`<link>` CSS形式の埋め込みを使う。**

- Kit単体ファミリー化で `<link rel="stylesheet" href="https://use.typekit.net/[kitId].css">` が使えるようになる
- `<link>` はHTMLパース時点からフォント読み込みが始まるため、JSスニペット方式より大幅に早い

```
改善後の読み込み順（<link>方式）:
HTMLパース → <link>でCSS読み込み → フォントファイル取得（並列）
```

### ヒラギノ角ゴの扱い

ヒラギノ角ゴ（hiragino-kaku-gothic-pron）はmacOS/iOSのシステムフォントであるため、Adobe Fontsから配信しなくてもApple端末では表示される。一方Windows/Androidには存在しないため、現在もフォールバックフォントが表示されている状況は変わらない。

**Kitから除外し、CSSでシステムフォント名を直接参照する方法に切り替える。**

```css
/* 変更前（globals.css） */
font-family: urw-din-semi-condensed, hiragino-kaku-gothic-pron, sans-serif;

/* 変更後 */
font-family: urw-din-semi-condensed, "Hiragino Kaku Gothic ProN", sans-serif;
```

---

## 実装手順

1. Adobe Fontsで新しいKitを作成（URW DIN / URW DIN Semi-Condensedのみ登録）
2. 新KitのIDを確認し、`layout.tsx` の `<link>` タグのURLを更新
3. `globals.css` のヒラギノ参照をAdobe Fonts変数名（`hiragino-kaku-gothic-pron`）からシステムフォント名（`"Hiragino Kaku Gothic ProN"`）に変更
4. 旧KitはAdobe Fontsダッシュボードで削除

---

## 現在の実装（暫定）

`app/layout.tsx` にて以下の状態で運用中：

- `preconnect` ヒント（`use.typekit.net`, `p.typekit.net`）を追加済み → DNS解決の先読みのみ有効
- JSスニペット方式（`afterInteractive`）は維持

