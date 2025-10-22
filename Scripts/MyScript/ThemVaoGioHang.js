document.addEventListener('DOMContentLoaded', function () {
    // 1. Lấy tất cả các nút "Đặt vé" VÀ "Thêm vào giỏ"
    const actionButtons = document.querySelectorAll('.btn-book, .btn-add-to-cart'); // Lấy cả 2 loại nút

    actionButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault(); // Luôn ngăn chuyển trang mặc định

            // 2. Tìm card cha
            const card = button.closest('.result-card-journey, .card'); // Tìm loại card nào cũng được

            if (!card) {
                console.error("Không tìm thấy card cha!");
                return;
            }

            // 3. Lấy thông tin từ card (Giữ nguyên như trước)
            const titleElement = card.querySelector('h3');
            const priceElement = card.querySelector('.price-info .amount');
            const quantityInput = card.querySelector('.quantity-value');

            // Cẩn thận hơn khi lấy text, kiểm tra xem thẻ có tồn tại không
            const title = titleElement ? titleElement.innerText : 'N/A';
            const priceText = priceElement ? priceElement.innerText : '0';
            const quantity = quantityInput ? parseInt(quantityInput.value) : 1; // Mặc định là 1 nếu không tìm thấy input

            let description = 'Không có mô tả';
            const routeElement = card.querySelector('.route');
            const descriptionElement = card.querySelector('.description'); // Selector cho mô tả chung
            const timeElement = card.querySelector('.time'); // Selector cho thời gian (nếu có)

            if (routeElement) {
                description = routeElement.innerText;
                if (timeElement) { // Ghép thêm thời gian nếu có
                    description += ` (${timeElement.innerText})`;
                }
            } else if (descriptionElement) {
                description = descriptionElement.innerText;
            }


            // 4. Tạo đối tượng vé (Giữ nguyên)
            const ticketItem = {
                id: Date.now() + Math.random(), // Thêm random để tránh trùng ID nếu click quá nhanh
                type: determineTicketType(card), // Thêm loại vé để hiển thị icon đúng
                title: title,
                description: description,
                price: priceText,
                quantity: quantity
            };

            // 5. Lưu vào localStorage
            saveToCart(ticketItem);

            // 6. Thông báo
            // Thay đổi thông báo một chút
            showNotification(`Đã thêm ${quantity} vé "${title}" vào giỏ hàng!`);

            // Nếu người dùng nhấn nút "Đặt vé ngay", có thể thêm hành động chuyển sang trang giỏ hàng sau khi thêm
            // if (button.classList.contains('btn-book')) {
            //     window.location.href = '/GioHang'; // Chuyển đến trang giỏ hàng (bỏ comment dòng này nếu muốn)
            // }
        });
    });
});

// Hàm xác định loại vé dựa trên class của card hoặc nội dung h2
function determineTicketType(card) {
    if (card.closest('.search-plane') || card.querySelector('h3')?.innerText.includes('Hãng bay')) return 'plane';
    if (card.closest('.search-train') || card.querySelector('h3')?.innerText.includes('Tàu')) return 'train';
    if (card.closest('.search-bus') || card.querySelector('h3')?.innerText.includes('Limousine') || card.querySelector('h3')?.innerText.includes('Nhà xe')) return 'bus';
    if (card.closest('.search-hotel') || card.querySelector('h3')?.innerText.includes('Hotel') || card.querySelector('h3')?.innerText.includes('Resort')) return 'hotel';
    if (card.closest('.search-car') || card.querySelector('h3')?.innerText.includes('Toyota') || card.querySelector('h3')?.innerText.includes('Honda') || card.querySelector('h3')?.innerText.includes('Ford')) return 'car';
    // Fallback nếu không xác định được
    if (card.querySelector('h3')?.innerText.includes('→')) return 'journey'; // Mặc định cho các chuyến đi gợi ý
    return 'default';
}


// Hàm lưu vào giỏ (Giữ nguyên như trước, nhưng gọi updateCartBadge cuối cùng)
function saveToCart(item) {
    let cartJson = localStorage.getItem('threeHorizonCart');
    let cart = [];
    if (cartJson) {
        try {
            cart = JSON.parse(cartJson);
            // Đảm bảo cart luôn là mảng
            if (!Array.isArray(cart)) {
                cart = [];
            }
        } catch (e) {
            console.error("Lỗi parse JSON từ localStorage:", e);
            cart = []; // Reset giỏ hàng nếu dữ liệu lỗi
            localStorage.removeItem('threeHorizonCart'); // Xóa dữ liệu lỗi
        }
    }

    // Kiểm tra xem vé đã có trong giỏ chưa (dựa vào title và description) - Nâng cao, có thể bỏ qua bước này nếu muốn đơn giản
    const existingItemIndex = cart.findIndex(cartItem => cartItem.title === item.title && cartItem.description === item.description);

    if (existingItemIndex > -1) {
        // Nếu đã có, chỉ cập nhật số lượng
        cart[existingItemIndex].quantity += item.quantity;
    } else {
        // Nếu chưa có, thêm mới
        cart.push(item);
    }


    localStorage.setItem('threeHorizonCart', JSON.stringify(cart));
    updateCartBadge(); // Cập nhật số trên icon
}

// Hàm hiển thị thông báo (thay cho alert)
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerText = message;
    document.body.appendChild(notification);

    // Tự động ẩn sau vài giây
    setTimeout(() => {
        notification.remove();
    }, 3000); // 3 giây
}