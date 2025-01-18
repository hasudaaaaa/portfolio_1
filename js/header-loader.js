/*
//header-loader.js を使用して外部から埋め込まれたHTMLでは、DOMContentLoaded イベントが既に発火した後にヘッダーが挿入されるため、
// humburger-menu.js 内の document.querySelector が正しく動作せず、必要な要素を見つけられないらしい。
//そのうち何とかします。多分。
*/
document.addEventListener('DOMContentLoaded', () => {
    fetch('/commonHTML/header.html') // 外部HTMLファイルを取得
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch header.html: ${response.statusText}`);
            }
            return response.text();
        })
        .then(html => {
            const header = document.querySelector('header');
            if (header) {
                header.innerHTML = html; // <header> にHTMLを挿入
            } else {
                console.warn('Header element not found!');
            }
        })
        .catch(error => console.error(error));
});