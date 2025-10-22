document.addEventListener('DOMContentLoaded', function () {
    renderCartItems(); // Gọi hàm để vẽ lại giỏ hàng
    addGlobalCartEventListeners(); // Thêm các sự kiện chung
});

// Hàm chính để vẽ lại các mục trong giỏ hàng
function renderCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    if (!cartItemsContainer) {
        console.error("Không tìm thấy container .cart-items");
        return;
    }

    // Lấy dữ liệu từ localStorage
    let cart = getCart(); // Dùng hàm helper

    // Xóa nội dung cũ trước khi vẽ lại
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">🛒 Giỏ hàng của bạn đang trống. Hãy quay lại trang Đặt Vé để thêm sản phẩm nhé!</p>';
    } else {
        cart.forEach(item => {
            // Tạo HTML cho từng item
            const itemHTML = createCartItemHTML(item);
            // Chèn vào container
            cartItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
        });
    }

    updateSummary(); // Cập nhật tóm tắt sau khi vẽ xong
}

// Hàm helper để lấy và parse giỏ hàng từ localStorage
function getCart() {
    let cartJson = localStorage.getItem('threeHorizonCart');
    let cart = [];
    if (cartJson) {
        try {
            cart = JSON.parse(cartJson);
            if (!Array.isArray(cart)) { // Đảm bảo luôn là mảng
                cart = [];
            }
        } catch (e) {
            console.error("Lỗi parse JSON từ localStorage:", e);
            cart = [];
            localStorage.removeItem('threeHorizonCart'); // Xóa dữ liệu lỗi
        }
    }
    return cart;
}

// Hàm tạo HTML cho một mục trong giỏ hàng
function createCartItemHTML(item) {
    // Xác định icon và label dựa trên loại vé
    let itemTypeIcon = '🎟️';
    let itemTypeName = 'Vé';
    let priceLabel = 'Giá vé';
    let quantityLabel = 'Số vé';

    switch (item.type) {
        case 'plane': itemTypeIcon = '✈️'; itemTypeName = 'Vé máy bay'; break;
        case 'train': itemTypeIcon = '🚄'; itemTypeName = 'Vé tàu'; break;
        case 'bus': itemTypeIcon = '🚌'; itemTypeName = 'Vé xe'; break;
        case 'hotel':
            itemTypeIcon = '🏨';
            itemTypeName = 'Khách sạn';
            priceLabel = 'Giá/đêm';
            quantityLabel = 'Số đêm';
            break;
        case 'car':
            itemTypeIcon = '🚗';
            itemTypeName = 'Thuê xe';
            priceLabel = 'Giá/ngày';
            quantityLabel = 'Số ngày';
            break;
    }

    // Làm sạch giá tiền (loại bỏ chữ, dấu chấm, giữ lại số)
    const priceNumber = parsePrice(item.price);

    // Trả về chuỗi HTML
    // Sử dụng data-id để lưu ID của item
    return `
        <div class="cart-item" data-id="${item.id}">
            <div class="item-header">
                <input type="checkbox" class="item-checkbox" checked>
                <span class="item-type">${itemTypeIcon} ${itemTypeName}</span>
                ${item.type === 'plane' ? '<span class="special-badge">Giá tốt</span>' : ''}
            </div>
            <div class="item-body">
                <div class="item-details">
                    <div class="item-route">${item.title}</div>
                    <div class="item-info">
                        <div class="info-row">
                            <span class="info-icon">ℹ️</span>
                            <span class="info-label">Chi tiết:</span>
                            <span class="info-value">${item.description || 'N/A'}</span>
                        </div>
                    </div>
                </div>
                <div class="item-pricing" data-price-per-item="${priceNumber}">
                    <div class="price-section">
                        <div class="price-label">${priceLabel}</div>
                        <div class="price-amount">${formatCurrency(priceNumber)}</div>
                    </div>
                    <div class="quantity-section">
                        <span class="quantity-label">${quantityLabel}:</span>
                        <div class="quantity-control">
                            <button class="quantity-btn decrease-qty" type="button">−</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1">
                            <button class="quantity-btn increase-qty" type="button">+</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="item-actions">
                 @* <button class="save-later-btn" type="button">💾 Lưu để đặt sau</button> *@
                <button class="remove-btn" type="button">🗑️ Xóa</button>
            </div>
        </div>
    `;
}

// Hàm thêm các event listener chung cho giỏ hàng
function addGlobalCartEventListeners() {
    const cartItemsContainer = document.querySelector('.cart-items');
    if (!cartItemsContainer) return;

    cartItemsContainer.addEventListener('click', function (event) {
        const target = event.target;
        const cartItemElement = target.closest('.cart-item');
        if (!cartItemElement) return; // Không click vào item nào cả

        const itemId = cartItemElement.dataset.id;

        // Xử lý nút Xóa
        if (target.classList.contains('remove-btn')) {
            removeItem(itemId);
        }
        // Xử lý nút giảm số lượng
        else if (target.classList.contains('decrease-qty')) {
            updateQuantity(itemId, -1);
        }
        // Xử lý nút tăng số lượng
        else if (target.classList.contains('increase-qty')) {
            updateQuantity(itemId, 1);
        }
        // Xử lý checkbox
        else if (target.classList.contains('item-checkbox')) {
            updateSummary(); // Chỉ cần cập nhật lại tổng tiền khi check/uncheck
        }
    });

    // Xử lý thay đổi trực tiếp trên input số lượng
    cartItemsContainer.addEventListener('change', function (event) {
        const target = event.target;
        if (target.classList.contains('quantity-input')) {
            const cartItemElement = target.closest('.cart-item');
            const itemId = cartItemElement.dataset.id;
            let newQuantity = parseInt(target.value);
            if (isNaN(newQuantity) || newQuantity < 1) {
                newQuantity = 1; // Đảm bảo số lượng >= 1
                target.value = 1;
            }
            updateQuantity(itemId, 0, newQuantity); // Cập nhật trực tiếp số lượng
        }
    });

}

// Hàm xóa một item khỏi giỏ hàng
function removeItem(itemId) {
    let cart = getCart();
    // Tạo mảng mới không chứa item cần xóa
    const newCart = cart.filter(item => item.id.toString() !== itemId.toString());
    // Lưu lại vào localStorage
    localStorage.setItem('threeHorizonCart', JSON.stringify(newCart));
    // Vẽ lại giao diện giỏ hàng
    renderCartItems();
    updateCartBadge(); // Cập nhật lại badge trên layout
}

// Hàm cập nhật số lượng
// delta = 1 (tăng), -1 (giảm), 0 (set trực tiếp bằng newValue)
function updateQuantity(itemId, delta, newValue = null) {
    let cart = getCart();
    const itemIndex = cart.findIndex(item => item.id.toString() === itemId.toString());

    if (itemIndex > -1) {
        if (newValue !== null) {
            cart[itemIndex].quantity = newValue >= 1 ? newValue : 1;
        } else {
            cart[itemIndex].quantity += delta;
        }

        // Đảm bảo số lượng không nhỏ hơn 1
        if (cart[itemIndex].quantity < 1) {
            cart[itemIndex].quantity = 1;
        }

        // Lưu lại giỏ hàng
        localStorage.setItem('threeHorizonCart', JSON.stringify(cart));
        // Cập nhật lại input trên giao diện và tổng tiền
        const inputElement = document.querySelector(`.cart-item[data-id="${itemId}"] .quantity-input`);
        if (inputElement) inputElement.value = cart[itemIndex].quantity;
        updateSummary();
    }
}


// Hàm cập nhật tóm tắt đơn hàng
function updateSummary() {
    const cartItems = document.querySelectorAll('.cart-item');
    const summaryContainer = document.querySelector('.summary-card'); // Tìm thẻ cha của phần summary
    if (!summaryContainer) return;

    let totalAmount = 0;
    let serviceFee = 80000; // Phí cố định (ví dụ)
    let vatRate = 0.1; // 10% VAT (ví dụ)

    // Reset các dòng chi tiết trong summary trước khi tính lại
    const existingRows = summaryContainer.querySelectorAll('.summary-row:not(:last-child)'); // Bỏ qua dòng Thuế VAT và Phí dịch vụ
    existingRows.forEach(row => row.style.display = 'none'); // Ẩn đi tạm thời

    cartItems.forEach(itemElement => {
        const checkbox = itemElement.querySelector('.item-checkbox');
        if (checkbox && checkbox.checked) { // Chỉ tính những item được check
            const pricingDiv = itemElement.querySelector('.item-pricing');
            const pricePerItem = parseFloat(pricingDiv.dataset.pricePerItem);
            const quantityInput = itemElement.querySelector('.quantity-input');
            const quantity = parseInt(quantityInput.value);

            if (!isNaN(pricePerItem) && !isNaN(quantity)) {
                totalAmount += pricePerItem * quantity;

                // Hiển thị lại hoặc cập nhật dòng summary tương ứng (nếu cần)
                // Ví dụ: Tìm dòng summary label dựa vào item type rồi cập nhật giá trị
                const itemTypeSpan = itemElement.querySelector('.item-type');
                if (itemTypeSpan) {
                    const itemTypeName = itemTypeSpan.innerText.trim();
                    let summaryLabel = `${itemTypeName} (x${quantity})`;
                    // Tìm hoặc tạo dòng summary tương ứng... (Logic này hơi phức tạp, tạm bỏ qua để đơn giản)
                }
            }
        }
    });

    // Tính thuế VAT dựa trên tổng tiền hàng (chưa bao gồm phí dịch vụ)
    let vatAmount = totalAmount * vatRate;
    // Tổng cộng cuối cùng
    let finalTotal = totalAmount + serviceFee + vatAmount;

    // Cập nhật vào HTML
    const serviceFeeEl = summaryContainer.querySelector('.summary-label:contains("Phí dịch vụ") + .summary-value');
    const vatEl = summaryContainer.querySelector('.summary-label:contains("Thuế VAT") + .summary-value');
    const totalAmountEl = summaryContainer.querySelector('.total-amount');

    if (serviceFeeEl) {
        serviceFeeEl.closest('.summary-row').style.display = totalAmount > 0 ? 'flex' : 'none'; // Chỉ hiện phí nếu có hàng
        serviceFeeEl.textContent = formatCurrency(serviceFee);
    }
    if (vatEl) {
        vatEl.closest('.summary-row').style.display = totalAmount > 0 ? 'flex' : 'none'; // Chỉ hiện VAT nếu có hàng
        vatEl.textContent = formatCurrency(vatAmount);
    }
    if (totalAmountEl) {
        totalAmountEl.textContent = formatCurrency(finalTotal);
    }

    // Tạm thời hiển thị tổng tiền hàng thô thay vì chi tiết từng loại
    const firstSummaryRowLabel = summaryContainer.querySelector('.summary-row .summary-label');
    const firstSummaryRowValue = summaryContainer.querySelector('.summary-row .summary-value');
    if (firstSummaryRowLabel && firstSummaryRowValue) {
        if (totalAmount > 0) {
            firstSummaryRowLabel.textContent = 'Tổng tiền hàng';
            firstSummaryRowValue.textContent = formatCurrency(totalAmount);
            firstSummaryRowLabel.closest('.summary-row').style.display = 'flex';
        } else {
            firstSummaryRowLabel.closest('.summary-row').style.display = 'none';
        }
    }
}

// Hàm helper để parse giá tiền (loại bỏ ký tự không phải số)
function parsePrice(priceString) {
    if (!priceString) return 0;
    // Loại bỏ ' VNĐ', '₫', '.', giữ lại số
    const cleanedString = priceString.replace(/[^0-9]/g, '');
    return parseFloat(cleanedString) || 0;
}

// Hàm helper để định dạng tiền tệ
function formatCurrency(amount) {
    if (isNaN(amount)) return "0₫";
    // Định dạng kiểu Việt Nam, có dấu phẩy ngăn cách hàng nghìn
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).replace(' ₫', '₫');
}