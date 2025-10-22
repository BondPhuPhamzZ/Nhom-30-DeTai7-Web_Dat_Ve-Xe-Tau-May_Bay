document.addEventListener('DOMContentLoaded', function () {
    //Lay tat ca card tren trang
    const allCards = document.querySelectorAll('.card, .result-card-journey');

    //Lap qua tung card de gan su kien
    allCards.forEach(function (card) {
        const plusBtn = card.querySelector('.plus-btn');
        const minusBtn = card.querySelector('.minus-btn');
        const quantityInput = card.querySelector('.quantity-value');

        //Dam bao cac phan tu ton tai truoc khi gan su kien
        if (plusBtn && minusBtn && quantityInput) {

            //Su kien khi nhan nut "+"
            plusBtn.addEventListener('click', function (event) {
                event.preventDefault(); //ngan hanh vi mac dinh cua button
                let currentValue = parseInt(quantityInput.value);
                currentValue++;
                quantityInput.value = currentValue;
            });

            //Su kien khi nhan nut "-"
            minusBtn.addEventListener('click', function (event) {
                event.preventDefault();
                let currentValue = parseInt(quantityInput.value);
                if (currentValue > 1) {
                    currentValue--;
                    quantityInput.value = currentValue;
                }
            });

            // Sự kiện khi người dùng thay đổi giá trị trong ô input
            quantityInput.addEventListener('change', function () {
                let currentValue = parseInt(quantityInput.value);
                // Kiểm tra nếu giá trị không hợp lệ
                if (isNaN(currentValue) || currentValue < 1) {
                    quantityInput.value = 1;
                }
                //Thuộc tính IsNotANumber
            });
        }
    });
});