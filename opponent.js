document.addEventListener("DOMContentLoaded", function () {
    const searchForm = document.getElementById("search-form");

    searchForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const opponentName = document.getElementById("champion-name").value.toLowerCase();
        const teamName = document.getElementById("ability-name").value.toLowerCase();

        let csvFile = "opponent.csv";
        let visibleColumns = ["name", "clan", "team1", "team2", "team3", "team4", "team5"];
        let columnMapping = {
            "name": "Ingame",
            "clan": "Bang",
            "team1": "Team 1",
            "team2": "Team 2",
            "team3": "Team 3",
            "team4": "Team 4",
            "team5": "Team 5"
        };

        Papa.parse(csvFile, {
            header: true,
            download: true,
            skipEmptyLines: true,
            complete: function (results) {
                const data = results.data;

                const searchResults = data.filter(row => {
                    const matchOpponentName = opponentName ?
                        (row.name.toLowerCase().includes(opponentName) || row.clan.toLowerCase().includes(opponentName) || row.name2.toLowerCase().includes(opponentName)) : true;
                    const matchTeamName = teamName ?
                        (row.team1.toLowerCase().includes(teamName) || row.team2.toLowerCase().includes(teamName) || row.team3.toLowerCase().includes(teamName) || row.team4.toLowerCase().includes(teamName) || row.team5.toLowerCase().includes(teamName)) : true;

                    return matchOpponentName && matchTeamName;
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
                        row.addEventListener("click", () => {
                            showPopup(rowData.name, rowData.clan, rowData.team1, rowData.team2, rowData.team3, rowData.team4, rowData.team5);
                        });
                    });

                    searchResultsContainer.appendChild(table);
                } else {
                    searchResultsContainer.textContent = "Không tìm thấy kết quả phù hợp.";
                    searchResultsContainer.style.textAlign = "center";
                }
            }
        });
    });
});


function showPopup(name, clan, team1, team2, team3, team4, team5) {
    if (!document.getElementById("popup-styles")) {
        const style = document.createElement("style");
        style.id = "popup-styles";
        style.innerHTML = `
            .popup-content p {
                margin-bottom: -5px;
            }
        `;
        document.head.appendChild(style);
    }
    
    const popupContainer = document.createElement("div");
    popupContainer.classList.add("popup-container");

    const popupContent = document.createElement("div");
    popupContent.classList.add("popup-content");
    
    let contentHTML = `
        <h2>Địch: ${name}</h2>
        <h3>Bang: ${clan}</h3>
        <p>Team 1: ${team1}</p>
    `;
    
    if (team2) contentHTML += `<p>Team 2: ${team2}</p>`;
    if (team3) contentHTML += `<p>Team 3: ${team3}</p>`;
    if (team4) contentHTML += `<p>Team 4: ${team4}</p>`;
    if (team5) contentHTML += `<p>Team 5: ${team5}</p>`;

    popupContent.innerHTML = contentHTML;
    popupContainer.appendChild(popupContent);
    document.body.appendChild(popupContainer);


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
