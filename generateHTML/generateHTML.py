import json
from string import Template
import os

# テンプレートHTMLファイルの読み込み
def load_template(file_path):
    """指定されたパスのテンプレートHTMLを読み込む関数"""
    with open(file_path, "r", encoding="utf-8") as file:
        return file.read()

# JSONデータの読み込み
def load_artworks(file_path):
    """指定されたパスのJSONデータを読み込む関数"""
    with open(file_path, "r", encoding="utf-8") as file:
        return json.load(file)

# 各作品のHTMLファイルを生成する関数
def generate_html_files(template_str, artworks):
    """テンプレートと作品データを元にHTMLファイルを生成する関数"""
    # 現在のスクリプトと同じディレクトリに出力する
    output_dir = os.path.dirname(__file__)

    for artwork in artworks:
        # テンプレートにデータを埋め込む
        template = Template(template_str)  # string.Templateを使用して置換用テンプレートを作成
        html_content = template.substitute(artwork)  # プレースホルダに対応する値を埋め込む

        # ファイル名を生成 ("No-$number.html" の形式)
        file_name = f"No-{artwork['number']}.html"  # JSONの"number"プロパティを使用してファイル名を生成
        file_path = os.path.join(output_dir, file_name)  # 出力先のパスを作成

        # HTMLファイルを書き出し
        with open(file_path, "w", encoding="utf-8") as file:
            file.write(html_content)  # 完成したHTMLをファイルに書き込む

        print(f"{file_path} を生成しました")  # 処理完了を出力

# メイン処理
if __name__ == "__main__":
    # テンプレートHTMLファイルのパス
    template_file_path = "./generateHTML/artwork-template.html"  # ディレクトリ構造に合わせた相対パス

    # 作品データJSONファイルのパス
    artworks_file_path = "./generateHTML/new-artworks.json"  # ディレクトリ構造に合わせた相対パス

    # テンプレートと作品データを読み込む
    template_html = load_template(template_file_path)  # テンプレートHTMLを読み込む
    artworks = load_artworks(artworks_file_path)  # JSONデータを読み込む

    # HTMLファイルを生成
    generate_html_files(template_html, artworks)
