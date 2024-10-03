document.addEventListener("DOMContentLoaded", function () {
    const kethuaButton = document.getElementById("kethua-button");
    const sukienButton = document.getElementById("sukien-button");
    const searchForm = document.getElementById("search-form");

    kethuaButton.addEventListener("click", function () {
        kethuaButton.classList.add("active");
        sukienButton.classList.remove("active");
    });

    sukienButton.addEventListener("click", function () {
        sukienButton.classList.add("active");
        kethuaButton.classList.remove("active");
    });

    searchForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const searchType = kethuaButton.classList.contains("active") ? "kethua" : "sukien";
        const championName = document.getElementById("champion-name").value.toLowerCase();
        const abilityName = document.getElementById("ability-name").value.toLowerCase();

        let csvFile;
        let visibleColumns;
        let columnMapping;

        if (searchType === "kethua") {
            csvFile = "kethua.csv";
            visibleColumns = ["name_en", "inherit_en", "name_vi", "innate_vi", "inherit_vi"];
            columnMapping = {
                "name_en": "English",
                "inherit_en": "Inherit Tactics",
                "name_vi": "Vietnamese",
                "innate_vi": "Chiến Pháp Mang Theo",
                "inherit_vi": "Chiến Pháp Kế Thừa"
            };
        } else if (searchType === "sukien") {
            csvFile = "sukien.csv";
            visibleColumns = ["name_en", "name_vi", "tactics_en", "tactics_vi", "season"];
            columnMapping = {
                "name_en": "English",
                "name_vi": "Vietnamese",
                "tactics_en": "Tactics",
                "tactics_vi": "Chiến Pháp",
                "season": "Mùa (Global)"
            };
        }

        Papa.parse(csvFile, {
            header: true,
            download: true,
            skipEmptyLines: true,
            complete: function (results) {
                const data = results.data;

                const searchResults = data.filter(row => {
                    // Điều kiện tìm kiếm khác nhau tùy thuộc vào searchType
                    let matchChampionName, matchAbilityName;
        
                    if (searchType === "kethua") {
                        // Điều kiện cho tệp kethua.csv
                        matchChampionName = championName ? 
                            (
                                row.name_en.toLowerCase().includes(championName)
                                || row.name_vi.toLowerCase().includes(championName)
                            ) : true;
                        matchAbilityName = abilityName ? 
                            (
                                row.inherit_en.toLowerCase().includes(abilityName)
                                || row.innate_vi.toLowerCase().includes(abilityName)
                                || row.inherit_vi.toLowerCase().includes(abilityName)
                            ) : true;
                    } else if (searchType === "sukien") {
                        // Điều kiện cho tệp sukien.csv
                        matchChampionName = championName ? 
                            (
                                row.name_en.toLowerCase().includes(championName)
                                || row.name_vi.toLowerCase().includes(championName)
                            ) : true;
                        matchAbilityName = abilityName ? 
                            (
                                row.tactics_en.toLowerCase().includes(abilityName)
                                || row.tactics_vi.toLowerCase().includes(abilityName)
                            ) : true;
                    }

                    return matchChampionName && matchAbilityName;
                });

                const searchResultsContainer = document.getElementById("search-results");
                searchResultsContainer.innerHTML = "";
                if (searchResults.length > 0) {
                    const table = document.createElement("table");
                    const headerRow = table.insertRow(0);
                    visibleColumns.forEach(columnKey => {
                        const th = document.createElement("th");
                        th.textContent = columnMapping[columnKey];
                        headerRow.appendChild(th);
                    });

                    searchResults.forEach(rowData => {
                        const row = table.insertRow(-1);
                        visibleColumns.forEach(columnName => {
                            const cell = row.insertCell();
                            cell.textContent = rowData[columnName];
                        });

                        // Thêm sự kiện nhấp vào dòng để hiển thị popup
                        if (searchType === "kethua") {
                            row.addEventListener("click", () => {
                                showPopup(rowData.innate_vi, rowData.innate_detail_vi, rowData.inherit_vi, rowData.inherit_detail_vi);
                            });
                        } else if (searchType === "sukien") {
                            row.addEventListener("click", () => {
                                showPopup(rowData.tactics_vi,rowData.tactics_detail_vi,undefined,undefined,rowData.name_vi);
                            });
                        }
                    });

                    searchResultsContainer.appendChild(table);
                } else {
                    searchResultsContainer.textContent = "Không tìm thấy kết quả phù hợp.";
                    searchResultsContainer.style.textAlign = "center";
                }
            }
        });
    });

    kethuaButton.classList.add("active");
});

function showPopup(innate_vi, innate_detail_vi, inherit_vi, inherit_detail_vi, material) {
    const popupContainer = document.createElement("div");
    popupContainer.classList.add("popup-container");

    const popupContent = document.createElement("div");
    popupContent.classList.add("popup-content");
    
    let contentHTML;
    if (inherit_vi !== undefined) {
        contentHTML = `
            <h2>Chiến Pháp Mang Theo: ${innate_vi}</h2>
            <p>${innate_detail_vi}</p>
            <h2>Chiến Pháp Kế Thừa: ${inherit_vi}</h2>
            <p>${inherit_detail_vi}</p>
        `;
    } else {
        contentHTML = `
            <h2>Chiến Pháp: ${innate_vi}</h2>
            <h3>Nguyên liệu: ${material}</h3>
            <p>${innate_detail_vi}</p>
        `;
    }

    // Thay thế các nội dung trong ngoặc vuông bằng thẻ <strong>
    contentHTML = contentHTML.replace(/\[([^\]]+)\]/g, '<strong>[$1]</strong>');

    // Gắn nội dung vào popup
    popupContent.innerHTML = contentHTML;

    popupContainer.appendChild(popupContent);

    // Thêm nút đóng vào popup content
    const closeButton = document.createElement("button");
    closeButton.classList.add("close-button");
    closeButton.textContent = "Đóng";
    closeButton.addEventListener("click", () => {
        popupContainer.remove();
    });
    popupContent.appendChild(closeButton);

    // Thêm sự kiện mousedown vào vùng xung quanh popup để đóng nó
    document.addEventListener("mousedown", (e) => {
        if (!popupContent.contains(e.target)) {
            popupContainer.remove();
        }
    });

    document.body.appendChild(popupContainer);
}
document.addEventListener("DOMContentLoaded", function () {
    const darkModeToggle = document.getElementById("dark-mode-toggle");

    // Kiểm tra nếu người dùng đã bật Dark Mode trước đó
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
        darkModeToggle.checked = true;
    }

    // Chuyển đổi Dark Mode khi người dùng nhấn nút
    darkModeToggle.addEventListener("change", function () {
        if (darkModeToggle.checked) {
            document.body.classList.add("dark-mode");
            localStorage.setItem("darkMode", "enabled");
        } else {
            document.body.classList.remove("dark-mode");
            localStorage.setItem("darkMode", null);
        }
    });
});
