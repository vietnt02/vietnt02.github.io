// script.js

// Hàm thực hiện tìm kiếm dữ liệu
function searchData() {
    // Lấy giá trị từ ô nhập tìm kiếm
    var searchInput = document.getElementById("searchInput").value.toLowerCase();

    // Đọc dữ liệu từ file CSV
    fetch('data.csv')
        .then(response => response.text())
        .then(data => {
            // Chuyển đổi dữ liệu CSV thành mảng các dòng
            var rows = data.split('\n');

            // Tìm kiếm dữ liệu trong cột Vietnamese và trả về kết quả từ cột Chiến Pháp Kế Thừa
            for (var i = 1; i < rows.length; i++) {
                var columns = rows[i].split(',');
                var vietnamese = columns[2].toLowerCase();
                var tactics = columns[5];

                if (vietnamese.includes(searchInput)) {
                    // Hiển thị kết quả
                    document.getElementById("searchResult").textContent = tactics;
                    return; // Dừng vòng lặp khi tìm thấy kết quả
                }
            }

            // Nếu không tìm thấy kết quả
            document.getElementById("searchResult").textContent = "Không tìm thấy kết quả.";
        })
        .catch(error => console.error(error));
}

// Hàm xử lý sự kiện khi nhấn phím "Enter"
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        searchData(); // Gọi hàm searchData() khi nhấn phím "Enter"
    }
}
