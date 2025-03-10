document.addEventListener('DOMContentLoaded', () => {
    const thumbnails = document.querySelectorAll('.main-artwork img');
    const modal = document.querySelector('.image-modal');
    const modalContent = document.querySelector('.modal-content');
    const modalContainer = document.querySelector('.modal-container');
    const closeBtn = document.querySelector('.close-btn');

    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            modalContent.src = thumbnail.src; // クリックした画像をモーダルにセット
            modal.classList.add('active'); // モーダルを表示
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active'); // モーダルを非表示
        modalContent.src = ''; // モーダル画像をリセット
    });

    modal.addEventListener('click', (e) => {
        // モーダル背景またはモーダルコンテナをクリックした場合のみ閉じる
        if (e.target === modal || e.target === modalContainer) {
            modal.classList.remove('active'); // モーダルを非表示
            modalContent.src = ''; // モーダル画像をリセット
        }
    });
});