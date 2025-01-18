document.addEventListener('DOMContentLoaded', () => {
    /**
     * 任意のIDを持つタグ内に、外部HTMLを読み込んで埋め込む汎用関数
     * @param {string} targetId - 埋め込み先の要素のID
     * @param {string} htmlFilePath - 外部HTMLファイルのパス
     */
    function loadExternalHTML(targetId, htmlFilePath) {
        const targetElement = document.getElementById(targetId); // 埋め込み先のID
        if (!targetElement) {
            console.warn(`Element with ID "${targetId}" not found.`);
            return;
        }

        fetch(htmlFilePath) // 外部HTMLファイルのパス
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch ${htmlFilePath}: ${response.statusText}`);
                }
                return response.text();
            })
            .then(html => {
                targetElement.innerHTML = html; // 読み込んだHTMLを埋め込み
            })
            .catch(error => console.error(error));
    }

    // --- 以下の部分を書き換え ---
    loadExternalHTML('menu-overlay', '/commonHTML/menu-overlay.html');
    loadExternalHTML('footer', '/commonHTML/footer.html');
    loadExternalHTML('rollup', '/commonHTML/rollup.html');
    // loadExternalHTML('埋め込み先のID', '埋め込むHTMLファイルのパス');
});