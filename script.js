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
        if (searchType === "kethua") {
            csvFile = "kethua.csv";
            visibleColumns = ["English", "Vietnamese", "Tactics in English", "Chiến Pháp"];
            
        } else if (searchType === "sukien") {
            csvFile = "sukien.csv";
            visibleColumns = ["English", "Vietnamese", "Tactics in English", "Chiến Pháp", "Mùa (Global)"];
        }

        Papa.parse(csvFile, {
            header: true,
            download: true,
            skipEmptyLines: true,
            complete: function (results) {
                const data = results.data;

                const searchResults = data.filter(row => {
                    const matchChampionName = championName ? (row.English.toLowerCase().includes(championName) || row.Vietnamese.toLowerCase().includes(championName)) : true;
                    const matchAbilityName = abilityName ? (row["Tactics in English"].toLowerCase().includes(abilityName) || row["Chiến Pháp"].toLowerCase().includes(abilityName)) : true;
                    return matchChampionName && matchAbilityName;
                });

                const searchResultsContainer = document.getElementById("search-results");
                searchResultsContainer.innerHTML = "";
                if (searchResults.length > 0) {
                    const table = document.createElement("table");
                    const headerRow = table.insertRow(0);
                    visibleColumns.forEach(columnName => {
                        const th = document.createElement("th");
                        th.textContent = columnName;
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
                                showPopup(rowData.mangtheo2, rowData.mangtheo, rowData.kethua, rowData["Chiến Pháp"]);
                            });
                        } else if (searchType === "sukien") {
                            row.addEventListener("click", () => {
                                showPopup(rowData.mangtheo2,rowData.mangtheo);
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

function showPopup(mangtheo2, mangtheo, kethua, chienPhap) {
    const popupContainer = document.createElement("div");
    popupContainer.classList.add("popup-container");

    const popupContent = document.createElement("div");
    popupContent.classList.add("popup-content");
    popupContent.innerHTML = `
        <h2>Thông Tin Chiến Pháp: ${mangtheo2}</h2>
        <p>${mangtheo}</p>
    `;

    if (kethua !== undefined) {
        const kethuaElement = document.createElement("div");
        kethuaElement.innerHTML = `
            <h2>Chiến Pháp Kế Thừa: ${chienPhap}</h2>
            <p>${kethua}</p>
        `;
        popupContent.appendChild(kethuaElement);
    }

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

