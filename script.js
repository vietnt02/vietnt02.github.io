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
        if (searchType === "kethua") {
            csvFile = "kethua.csv";
        } else if (searchType === "sukien") {
            csvFile = "sukien.csv";
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
                    for (const key in searchResults[0]) {
                        const th = document.createElement("th");
                        th.textContent = key;
                        headerRow.appendChild(th);
                    }
                    searchResults.forEach(rowData => {
                        const row = table.insertRow(-1);
                        for (const key in rowData) {
                            const cell = row.insertCell();
                            cell.textContent = rowData[key];
                        }
                    });
                    searchResultsContainer.appendChild(table);
                } else {
                    searchResultsContainer.textContent = "Không tìm thấy kết quả phù hợp.";
                }
            }
        });
    });

    kethuaButton.classList.add("active");
});
