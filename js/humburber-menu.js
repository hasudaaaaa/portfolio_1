document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.querySelector('.humburger-menu');
    const menuOverlay = document.querySelector('.menu-overlay');
    const overlay = document.createElement('div');
    const menuIcon = menuButton.querySelector('.menu-icon');

    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    const menuOpenIcon = "images/icons/menu_24dp_5F6368_FILL0_wght300_GRAD0_opsz24.svg"; // 通常時
    const menuCloseIcon = "images/icons/close_24dp_5F6368_FILL0_wght300_GRAD0_opsz24.svg"; // 展開時

    menuButton.addEventListener('click', () => {
        const isActive = menuOverlay.classList.toggle('active');
        overlay.classList.toggle('active');
        menuButton.classList.toggle('active');

        // アイコンを切り替え
        menuIcon.src = isActive ? menuCloseIcon : menuOpenIcon;
    });

    overlay.addEventListener('click', () => {
        menuOverlay.classList.remove('active');
        overlay.classList.remove('active');
        menuButton.classList.remove('active');

        // アイコンを元に戻す
        menuIcon.src = menuOpenIcon;
    });
});