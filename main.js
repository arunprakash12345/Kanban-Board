const addBtn = document.querySelectorAll('.add-btn');
const cancelBtn = document.querySelector('.cancel-btn');
const close = document.querySelector('.close');
const modal = document.querySelector(".modal");
const createTicket = document.getElementById("create");
const title = document.getElementById("title");
const description = document.getElementById("description");
const priorityCards = document.querySelectorAll('.priority-card');
const filterContainer = document.querySelectorAll(".filter-card");
const emptyStateContainer = document.querySelector(".empty-state");
const mainContainer = document.querySelector(".main-cont");
const deleteButton = document.querySelector(".remove-btn");
let filterValue;
let titleContent;
let desc;
let priority;
const priorityLabel = {
    veryHigh: "Very High",
    high: "High",
    medium: "Medium",
    low: "Low"
};

addBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
        modal.showModal();
    });
});

cancelBtn.addEventListener("click", () => {
    closeModal();
});
close.addEventListener("click", () => {
    closeModal();
});

createTicket.addEventListener("click", () => {
    titleContent = title.value;
    desc = description.value;
    title.value = "";
    description.value = "";
    resetCards(priorityCards);
    createTask(titleContent, desc);
});


priorityCards.forEach((card) => {
    card.addEventListener("click", () => {
        const prio = card.getAttribute("priority");
        if (prio === null) return;
        resetCards(priorityCards)

        card.classList.remove("priority-card-border");
        card.classList.add(prio);
        priority = prio
    });
});

function resetCards(priorityCards) {
    priorityCards.forEach((c) => {
        c.classList.remove("veryHigh", "high", "medium", "low", "all");
        c.classList.add("priority-card-border");
    });
}

function closeModal() {
    title.value = "";
    description.value = "";
    resetCards(priorityCards);
    modal.close();
}

filterContainer.forEach((filterCard) => {
    filterCard.addEventListener("click", () => {
        const prio = filterCard.getAttribute("priority");
        if (prio === null) return;
        filterValue = prio;
        resetCards(filterContainer);
        filterCard.classList.remove("priority-card-border");
        filterCard.classList.add(prio);
        displayFilteredCards(prio);
    });
})


function createTask(titleContent, desc) {
    modal.close();
    emptyStateContainer.style.display = "none";
    const ticket = document.createElement("div");
    ticket.classList.add("ticket-cont");
    ticket.setAttribute("data-priority", priority);
    ticket.innerHTML = `
    <div class="row">
          <div class="tag ${priority}">${priorityLabel[priority]}</div>
          <div class="ticket-lock">
            <i class="fa-solid fa-lock"></i>
          </div>
        </div>
        <div class="ticket-id">${titleContent}</div>
        <div class="ticket-area">
          ${desc}
        </div>`;
    mainContainer.appendChild(ticket);
}
function displayFilteredCards(prio) {
    const tickets = document.querySelectorAll(".ticket-cont");

    tickets.forEach((ticket) => {

        const ticketPriority = ticket.getAttribute("data-priority");

        if (prio === "all") {
            ticket.style.display = "block";
        }
        else if (ticketPriority === prio) {
            ticket.style.display = "block";
        }
        else {
            ticket.style.display = "none";
        }

    });
}

deleteButton.addEventListener("click", (e) => {
    const tickets = document.querySelectorAll(".ticket-cont");
    const length = tickets.length;
    tickets[length - 1].remove();
    const updatedTickets = document.querySelectorAll(".ticket-cont");
    if (updatedTickets.length === 0)
        emptyStateContainer.style.display = "flex";
})