function updateCartBadge() {
    let cartJson = localStorage.getItem('threeHorizonCart');
    let cart = [];
    if (cartJson) {
        cart = JSON.parse(cartJson);
    }

    const cartContainer = document.querySelector('.cart-container');
    if (!cartContainer) return;

    // Tìm xem có badge cũ không
    let badge = cartContainer.querySelector('.cart-badge');

    if (cart.length > 0) {
        // Tính tổng số lượng (nếu bạn muốn) hoặc chỉ là số loại vé
        const totalItems = cart.length; // Đây là số *loại* vé
        // const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0); // Đây là tổng số lượng vé

        if (badge) {
            // Nếu có rồi thì cập nhật số
            badge.innerText = totalItems;
        } else {
            // Nếu chưa có, tạo mới
            badge = document.createElement('span');
            badge.classList.add('cart-badge');
            badge.innerText = totalItems;
            cartContainer.appendChild(badge); // Gắn vào
        }
    } else {
        // Nếu giỏ hàng rỗng, xóa badge đi
        if (badge) {
            badge.remove();
        }
    }
}

// Gọi hàm này ngay khi trang vừa tải xong
document.addEventListener('DOMContentLoaded', function () {
    // Gọi hàm cập nhật badge
    updateCartBadge();
});