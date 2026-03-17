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
const deleteTicket = document.querySelectorAll(".delete-ticket");
let filterValue;
let titleContent;
let desc;
const priorityLabel = {
    veryHigh: "Very High",
    high: "High",
    medium: "Medium",
    low: "Low"
};
let priority = "veryHigh";


addBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
        modal.showModal();
        priority = "veryHigh";
        resetCards(priorityCards);
        priorityCards[0].classList.remove("priority-card-border");
        priorityCards[0].classList.add("veryHigh");
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
    createTask(titleContent, desc);
    closeModal();

});


priorityCards.forEach((card) => {
    card.addEventListener("click", () => {
        const prio = card.getAttribute("priority");
        if (prio === null) return;
        resetCards(priorityCards);

        card.classList.remove("priority-card-border");
        card.classList.add(prio);
        priority = prio;
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
        <div class="action-cont">
            <i class="fa-solid fa-lock" id="lock"></i>
             <i class="fa-solid fa-trash-can delete-ticket"></i>
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

mainContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-ticket")) {
        const ticket = e.target.closest(".ticket-cont");
        ticket.remove();

        const updatedTickets = document.querySelectorAll(".ticket-cont");
        if (updatedTickets.length === 0)
            emptyStateContainer.style.display = "flex";
    }
});