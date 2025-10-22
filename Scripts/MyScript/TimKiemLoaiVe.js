document.addEventListener('DOMContentLoaded', function () {
    const allTabs = document.querySelectorAll('.tab-buttons input[name="service"]'); //Danh sách tất cả các nút chọn dịch vụ
    const allForms = document.querySelectorAll('.form-service'); //Danh sách tất cả các form nhập thông tin vé (mỗi dịch vụ có form riêng)

    const allFeaturedSections = document.querySelectorAll('.trip-results .trip-section'); //Những chuyến đi nổi bật
    const allSearchSections = document.querySelectorAll('#search-results-container .search-section'); //Chứa kết quả khi bấm tìm vé => con của searchContainer => lặp qua và chỉ hiển thị đúng loại card (vé) kết quả của thể loại vé đó
    const searchContainer = document.getElementById('search-results-container'); //Bọc toàn bộ vùng kết quả tìm kiếm => ẩn và hiện toàn bộ khu vực kết quả trên trang, khi chưa tìm kiếm thì ẩn thằng cha này nó đi, có kết quả thì hiện nó ra

    // Show các chuyến đi nổi bật (gợi ý)
    function showFeaturedSection(serviceType) {
        allFeaturedSections.forEach(section => section.classList.remove('active')); //Ẩn toàn bộ phần nổi bật = cách xóa class "active"

        const targetSection = document.querySelector('.trip-results .trip-' + serviceType); //Tìm đúng phần tử cần hiển thị => VD: serviceType = 'plane' thì sẽ tìm .trip-plane
        if (targetSection) {
            targetSection.classList.add('active'); //Thêm class active để hiển thị phần đó => CSS đảm nhận
        }
    }

    // Khi người dùng đổi tab (chọn dịch vụ khác) => show những chuyến đi nổi bật (gợi ý)
    allTabs.forEach(tab => {
        tab.addEventListener('change', function () {
            //Biến serviceType lấy ID của tab đang được chọn => cắt bỏ phẩn "tab-" => lấy ra mỗi dịch vụ "plane"
            const serviceType = this.id.replace('tab-', ''); //VD: "tab-plane" => "plane" 
            showFeaturedSection(serviceType); //Hiển thị phần vé nổi bất tương ứng, VD: nếu serviceType là "plane" => nó sẽ tìm phẩn tử có class là .trip-plane => thêm active vào phần tử đó và ẩn các khối khác

            //Ẩn các kết quả tìm kiếm khi chuyển tab
            hideAllSearchSections();
        });
    });

    //Ẩn tất cả phần kết quả tìm kiếm
    function hideAllSearchSections() {
        allSearchSections.forEach(section => {
            section.classList.remove('active');
        });
        // Ẩn container lớn khi không có kết quả nào active
        if (searchContainer) {
            searchContainer.style.display = 'none';
        }
    }

    // Show kết quả tìm kiếm
    function showSearchSection(serviceType) {
        //Ẩn tất cả các khối kết quả (cũ) tìm kiếm khác
        hideAllSearchSections();

        //Tìm và hiển thị đúng khối kết quả tìm kiếm
        const targetSection = document.querySelector('#search-results-container .search-' + serviceType); // VD: Tìm đúng phần .search-plane hoặc search-train,...

        if (targetSection) {
            //Hiện container
            if (searchContainer) {
                searchContainer.style.display = 'block';
            }
            //Active ngay lập tức
            targetSection.classList.add('active'); //hiển thị khu vực kết quả (thêm active vào div chưa kết quả tìm kiếm)
            requestAnimationFrame(() => { // Đảm bảo section render xong trước khi cuộn
                const targetPosition = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: targetPosition, //(cuộn trang mượt) đến vị trí đã tính
                    behavior: 'smooth'
                });
            });
            ////Thêm loading state (tùy chọn)
            //targetSection.classList.add('loading'); //Thêm class loading nếu có hiệu ứng tải

            ////Giả lập delay tìm kiếm
            ////Tọ độ trễ giả lập 300ms
            //setTimeout(() => {
            //    targetSection.classList.remove('loading'); //Thêm class loading => có thể dùng thêm CSS
            //    targetSection.classList.add('active'); //class "loading"

            //    // Cuộn trang mượt mà đến khu vực kết quả
            //    // Offset thêm 20px để không bị dính header
            //    const targetPosition = targetSection.offsetTop - 20;
            //    //Cuộn mượt trang đến phần kết quả
            //    window.scrollTo({
            //        top: targetPosition,
            //        behavior: 'smooth'
            //    });
            //}, 300);
        }
        else {
            console.warn("Không tìm thấy khu vực kết quả cho:", serviceType);
        }
    }

    //=> khi người dùng nhấn nút Tìm Vé
    allForms.forEach(form => {
        const searchButton = form.querySelector('.btn-search'); //Lặp qua từng form và gắn sự kiện click vào nút tìm kiếm .btn-search

        if (searchButton) {
            searchButton.addEventListener('click', function (event) {
                event.preventDefault(); //Ngăn chặn href tải lại trang (mặc định) => Javascript có thể xử lý

                // Kiểm tra validation form (dữ liệu)
                const formInputs = form.querySelectorAll('input[required], select[required]'); //tìm các input và select có thuộc tính required trong form hiện tại

                let isValid = true;
                formInputs.forEach(input => {
                    //Kiem tra xem co o nao bi bo trong khong (thuoc tinh required) => vien do trong 2s (alert)
                    if (!input.value.trim()) {
                        isValid = false;
                        input.style.borderColor = 'red';

                        // Reset border sau 2 giây
                        setTimeout(() => {
                            input.style.borderColor = '';
                        }, 2000);
                    }
                });

                //Nếu có ô bị bỏ trống
                if (!isValid) {
                    alert('Vui lòng điền đầy đủ thông tin!');
                    return;
                }

                // Lấy serviceType từ thuoc tinh href
                const serviceType = this.getAttribute('href').replace('.trip-', ''); //VD: .trip-plane => plane
                showSearchSection(serviceType);
            });
        }
    });

    //Hiển thị mặc định khi vào trang (vừa tải xong)
    const initialActiveTab = document.querySelector('.tab-buttons input[name="service"]:checked'); //Khi trang mới mở => tìm tab nào dang chọn (checked)

    if (initialActiveTab) {
        const initialServiceType = initialActiveTab.id.replace('tab-', ''); //Lấy loại dịch vụ tương ứng
        showFeaturedSection(initialServiceType); //Hiển thị phần vé nổi bật (gợi ý)
    }

    //Ẩn vùng kết quả tìm kiếm nếu chưa có gì
    if (searchContainer) {
        const hasActiveSearch = searchContainer.querySelector('.search-section.active');
        if (!hasActiveSearch) //Nếu chưa có phần nào active
        {
            searchContainer.style.display = 'none';
        }
    }

    //Khi có kết quả => tự động Ẩn/ hiển thị vùng kết quả tìm kiếm => Đảm bảo vùng kết quả chỉ chiếm không gian trên trang khi thực sự có kết quả để hiển thị
    //const observer = new MutationObserver(function (mutations) //MutationObserver là người quan sát => các thay đổi trong DOM
    //{
    //    //Tham số mutations là một mảng lưu các thay đổi (mutation records)
    //    mutations.forEach(function (mutation) {
    //        if (mutation.type === 'attributes' && mutation.attributeName === 'class') //Khi có một thuộc tính (attribute) nào đó thay đổi, VD: ID, class,... => Còn attributeName === 'class' là chỉ cần quan tâm đến thay đổi thuộc tính class => Nếu phần tử nào đó thay đổi class (active/ inactive) => đoạn code sẽ chạy hoặc không
    //        {
    //            //Nếu có phần active => hiển thị searchContainer (khối chứa toàn bộ kết quả tìm kiếm)
    //            const hasActive = searchContainer.querySelector('.search-section.active'); //Tìm bên trong thằng class searchContainer xem có phần tử nào có class là .search-section.active không => có trả về truthy, không thì trả về null (falsy) 
    //            if (hasActive) {
    //                searchContainer.style.display = 'block';
    //            } else {
    //                searchContainer.style.display = 'none';
    //            }
    //        }
    //    });
    //});

    //// Theo dõi thay đổi class trong search sections (các phần tử cần quan sát)
    //allSearchSections.forEach(section => {
    //    observer.observe(section, { attributes: true }); //Quan sát phần tử này, chỉ đẻ ý khi thuộc tính (attributes) thay đổi
    //});
});