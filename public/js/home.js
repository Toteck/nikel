const myModal = new bootstrap.Modal("#transaction-modal");
let logged = sessionStorage.getItem("logged");
const session = localStorage.getItem("session")

let data = {
    transactions: []
}

document.getElementById("logo").addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "home.html"
})

document.getElementById("button-logout").addEventListener("click", logout)
document.getElementById("transactions-button").addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "transactions.html"
})

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
    getCashIn();
    getCashOut();
    getTotal();

    alert("Lançamento adicionado com sucesso!");
})

checkedLogged();
getCashIn();
getCashOut();
getTotal();

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

    console.log(data)
}

function logout() {
    sessionStorage.removeItem("logged");
    localStorage.removeItem("session");

    window.location.href = "index.html"
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

function getCashIn() {
    const transactions = data.transactions;

    const cashIn = transactions.filter((transaction) => transaction.type === "1");

    if (cashIn.length) {
        let cashInHtml = ``
        let limit = 0;

        if (cashIn.length > 5) {
            limit = 5
        } else {
            limit = cashIn.length;
        }

        for (let index = 0; index < limit; index++) {
            cashInHtml += `
                <div class="row mb-4">
                    <div class="col-12">
                        <p class="value-text text-primary fw-bold nowrap"> + R$ ${cashIn[index].value.toFixed(2)}</p>
                        <di class="container p-0">
                            <div class="row align-items-center">
                                <div class="col-12 col-md-8 text-muted mb-1 mb-md-0">
                                    <p class="mb-0">${cashIn[index].description}</p>
                                </div>
                                <div class="col-12 col-md-4 d-flex justify-content-start justify-content-md-end">
                                    <span class="date-text">${formatDateTOBR(cashIn[index].date)}</span>
                                </div>
                            </div>
                    </div>
                </div>
            `
        }

        document.getElementById("cash-in-list").innerHTML = cashInHtml;
    }


}

function getCashOut() {
    const transactions = data.transactions;

    const cashIn = transactions.filter((transaction) => transaction.type === "2");

    if (cashIn.length) {
        let cashInHtml = ``
        let limit = 0;

        if (cashIn.length > 5) {
            limit = 5
        } else {
            limit = cashIn.length;
        }

        for (let index = 0; index < limit; index++) {
            cashInHtml += `
                <div class="row mb-4">
                    <div class="col-12">
                        <p class="value-text text-danger fw-bold">- R$ ${cashIn[index].value.toFixed(2)}</hp>
                        <di class="container p-0">
                            <div class="row align-items-center">
                                <div class="col-12 col-md-8 text-muted mb-1 mb-md-0">
                                    <p class="mb-0">${cashIn[index].description}</p>
                                </div>
                                <div class="col-12 col-md-4 d-flex justify-content-start justify-content-md-end">
                                    <span class="date-text">${formatDateTOBR(cashIn[index].date)}</span>
                                </div>
                            </div>
                    </div>
                </div>
            `
        }

        document.getElementById("cash-out-list").innerHTML = cashInHtml;
    }


}

function getTotal() {
    const transactions = data.transactions;

    let total = 0;

    transactions.forEach((item) => {
        if (item.type === "1") {
            total += item.value;
        } else {
            total -= item.value;
        }
    })

    document.getElementById("total").innerHTML = `R$ ${total.toFixed(2)}`;
}

function saveData(data) {
    localStorage.setItem(data.login, JSON.stringify(data));
}