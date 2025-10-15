/* Javascript cho dark / light mode của web */
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme'); /* Kiểm tra xem trong locaclStorage đã tồn tại mục nào là "theme" chưa */

//Nếu thư mục có tồn tại (lưu lại thay đổi trong biến "currentTheme")
if (currentTheme) {
    document.body.classList.add(currentTheme); /* Áp dụng thư mục đã tồn tại đó cho body (khi chuyển trang thì đảm bảo nó vẫn lưu) */
    if (currentTheme === 'dark') /* Nếu theme đã được set là "dark" => tự động bật themeToggle lên */ {
        themeToggle.checked = true; /* Giữ nguyên theme toggle */
    }
}

//Khi click toggle thì sẽ xảy ra sự kiện "change" => "change" được định nghĩa sẵn trong trình duyệt
themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) /* Nếu nút gạt đã được bật */ {
        document.body.classList.add('dark'); /* Thêm class "dark" vào theme => khai báo "dark" ở CSS */
        localStorage.setItem('theme', 'dark'); //Lưu lựa chọn vào "ngắn kéo" => "theme" trong localStorage
    }

    else /* Ngược lại nếu nút gạt được tắt */ {
        document.body.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
});