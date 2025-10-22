//Javascript gợi ý những vé nổi bật dành riêng cho loại vé đó
document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll('.tab-buttons input[type="radio"]');
    const sections = document.querySelectorAll('.trip-section'); //Tìm các khối kết quả lưu vào danh sách "sections"

    tabs.forEach(tab => {
        tab.addEventListener('change', function () {
            const id = this.id.replace('tab-', 'trip-'); //Lấy ID nút vừa được click (this) => đổi "tab-" sang "trip-" => "tab-plane"
            sections.forEach(sec => sec.classList.remove('active')); //Tìm các khối trip-section - xóa class active (ẩn các khối kết quả khác đang hiện)
            const active = document.querySelector(`.${id}`); //Tìm khối tương ứng với id vừa tạo
            if (active)
                active.classList.add('active'); //Nếu tìm thấy => thêm active vào để nó hiện ra
        });
    });
});