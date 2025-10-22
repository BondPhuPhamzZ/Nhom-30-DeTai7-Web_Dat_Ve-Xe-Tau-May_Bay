document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.hamburger-menu');
    // Lấy toàn bộ thanh nav-bar
    const navBar = document.querySelector('.nav-bar');

    if (hamburger && navBar) {
        hamburger.addEventListener('click', function () {
            // Thêm/xóa class 'mobile-active' trên toàn bộ nav-bar
            navBar.classList.toggle('mobile-active');
        });
    }
});