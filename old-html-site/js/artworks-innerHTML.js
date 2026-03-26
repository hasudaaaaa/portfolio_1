// 作品データを外部ファイルから読み込む
fetch('/artworks/artworks.json')
    .then(response => response.json()) // JSON形式で読み込む
    .then(artworks => {
        let galleryContainer = document.getElementById('gallery-container');
        artworks.forEach(artwork => {
            // 埋め込むHTMLを作成
            let artworkHTML = `
                <li class="artworks-item">
                    <a href="${artwork.pageURL}">
                        <div class="thumbnail-frame"><img src="${artwork.thumbnailPath}"/></div>
                        <h3 class="artworks-item-title">${artwork.title}</h3>
                    </a>
                </li>
            `;
            galleryContainer.innerHTML += artworkHTML;
        });
    })
    .catch(error => console.error('データの読み込みに失敗しました:', error));