// 作品データを外部ファイルから読み込む
fetch('/blogs/blogs.json')
    .then(response => response.json()) // JSON形式で読み込む
    .then(blogs => {
        let galleryContainer = document.getElementById('gallery-container');
        blogs.forEach(blog => {
            // 埋め込むHTMLを作成
            let blogHTML = `
                <li class="blogs-item">
                    <a href="${blog.pageURL}">
                        <div class="thumbnail-frame"><img src="${blog.thumbnailPath}"/></div>
                        <h3 class="blogs-item-title">${blog.title}</h3>
                        <div class="blog-date"><small>${blog.date}</small></div>
                    </a>
                </li>
            `;
            galleryContainer.innerHTML += blogHTML;
        });
    })
    .catch(error => console.error('データの読み込みに失敗しました:', error));