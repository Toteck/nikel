const myModal = new bootstrap.Modal("#transaction-modal");
let logged = sessionStorage.getItem("logged");
const session = localStorage.getItem("session")

let data = {
    transactions: []
}

document.getElementById("button-logout").addEventListener("click", logout)

document.getElementById("logo").addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "home.html"
})

checkedLogged();
getTransactions()

document.getElementById("select-all").addEventListener("change", function (e) {
    const checkboxes = document.querySelectorAll(".transaction-checkbox");
    checkboxes.forEach(cb => cb.checked = e.target.checked);
});

document.getElementById("delete-selected").addEventListener("click", function () {
    const selected = Array.from(document.querySelectorAll(".transaction-checkbox:checked"))
        .map(cb => parseInt(cb.dataset.index));

    if (selected.length === 0) {
        alert("Nenhum lançamento selecionado!");
        return;
    }

    if (confirm(`Excluir ${selected.length} lançamento(s)?`)) {
        data.transactions = data.transactions.filter((_, index) => !selected.includes(index));
        saveData(data);
        getTransactions();
        alert("Lançamento(s) excluído(s) com sucesso!");
    }
});


// ADICIONAR LANÇAMENTO
document.getElementById("transaction-form").addEventListener("submit", function (e) {
    e.preventDefault()

    const value = parseFloat(document.getElementById("value-input").value);
    const description = document.getElementById("description-input").value
    const date = document.getElementById("date-input").value
    const type = document.querySelector('input[name="type-input"]:checked').value;

    data.transactions.unshift({
        value: value,
        type: type,
        description: description,
        date: date,
    })

    saveData(data);
    e.target.reset();
    myModal.hide();

    getTransactions()

    alert("Lançamento adicionado com sucesso!");
})

function checkedLogged() {
    if (session) {
        sessionStorage.setItem("logged", session);
    }

    if (!logged) {
        window.location.href = "index.html"
    }

    const dataUser = localStorage.getItem(logged);

    if (dataUser) {
        data = JSON.parse(dataUser);
    }


}

function saveData(data) {
    localStorage.setItem(data.login, JSON.stringify(data));
}

function formatDateTOBR(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return dateString; // se a data for inválida, retorna a string original

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(1, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}


function getTransactions() {
    const transactions = data.transactions;
    let transactionsHtml = ``;

    if (transactions.length) {
        transactions.forEach((item, index) => {
            let type = "Entrada";

            if (item.type === "2") {
                type = "Saída";
            }

            transactionsHtml += `
                <tr>
                    <td><input type="checkbox" class="transaction-checkbox" data-index="${index}"></td>
                    <th scope="row">${formatDateTOBR(item.date)}</th>
                    <td>${item.value}</td>
                    <td>${type}</td>
                    <td>${item.description}</td>
                </tr>
            `
        })
    }

    document.getElementById("transactions-list").innerHTML = transactionsHtml;
}


function logout() {
    sessionStorage.removeItem("logged");
    localStorage.removeItem("session");

    window.location.href = "index.html"
}

