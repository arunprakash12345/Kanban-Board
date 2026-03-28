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
const lanes = document.querySelectorAll(".lane");
const deleteTicket = document.querySelectorAll(".delete-ticket");
const lockTicket = document.querySelectorAll(".lock-ticket");
const editButtons = document.querySelectorAll(".edit-ticket");
let ticketsArr = JSON.parse(localStorage.getItem("tickets")) || [];
const toast = document.getElementById("toastMessage");
let editingTicket = null;
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
    if (editingTicket) {
        const ticketId = Number(editingTicket.getAttribute("data-id"));
        editingTicket.querySelector(".ticket-id").innerText = titleContent;
        editingTicket.querySelector(".ticket-area").innerText = desc;
        editingTicket.querySelector(".tag").className = `tag ${priority}`;
        editingTicket.querySelector(".tag").innerText = priorityLabel[priority];
        editingTicket.setAttribute("data-priority", priority);
        ticketsArr = ticketsArr.map((task) => {
            if (task.id === ticketId) {
                task.title = titleContent;
                task.desc = desc;
                task.priority = priority;
            }
            return task;
        });
        saveToLocalStorage();
        moveToLane(editingTicket, priority);
        editingTicket = null;
    } else {
        title.value = "";
        description.value = "";
        createTask(titleContent, desc);

    }
    createTicket.innerText = "Create Task";
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
    const taskObj = {
        id: Date.now(),
        title: titleContent,
        desc: desc,
        priority: priority
    }
    ticketsArr.push(taskObj);
    saveToLocalStorage();
    createTaskCard(taskObj);
    showToast("Task created successfully");

}
function createTaskCard(taskObj) {

    const ticket = document.createElement("div");

    ticket.classList.add("ticket-cont");
    ticket.setAttribute("data-priority", taskObj.priority);
    ticket.setAttribute("data-id", taskObj.id);
    ticket.setAttribute("draggable", true);
    ticket.innerHTML = `
    <div class="row">
        <div class="tag ${taskObj.priority}">
            ${priorityLabel[taskObj.priority]}
        </div>
        <div class="action-cont">
            <i class="fas fa-edit" id="edit"></i>
            <i class="fa-solid fa-trash-can delete-ticket"></i>
        </div>
    </div>
    <div class="ticket-id">${taskObj.title}</div>
    <div class="ticket-area">${taskObj.desc}</div>
    `;
    displayTicketCount();

    moveToLane(ticket, taskObj.priority);
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
        const ticketId = ticket.getAttribute("data-id");
        ticketsArr = ticketsArr.filter((task) => task.id !== Number(ticketId));
        saveToLocalStorage();
        showToast("Task deleted successfully");
        ticket.remove();
        const updatedTickets = document.querySelectorAll(".ticket-cont");
        if (updatedTickets.length === 0)
            emptyStateContainer.style.display = "flex";
    }
    displayTicketCount();

});

mainContainer.addEventListener("click", (e) => {
    const editBtn = e.target.closest(".fa-edit");

    if (editBtn) {
        const ticketElement = editBtn.closest(".ticket-cont");
        const titleText = ticketElement.querySelector(".ticket-id").innerText;
        const descText = ticketElement.querySelector(".ticket-area").innerText;
        const currpriority = ticketElement.getAttribute("data-priority");
        createTicket.innerText = "Update Task";
        editingTicket = ticketElement;
        modal.showModal();
        title.value = titleText;
        description.value = descText;
        resetCards(priorityCards);
        priorityCards.forEach((cards) => {
            const prio = cards.getAttribute("priority");
            if (prio === currpriority) {
                cards.classList.remove("priority-card-border");
                cards.classList.add(currpriority);
            }
        });
    }
});


function moveToLane(ticket, priority) {
    lanes.forEach((lane) => {
        const lanePriorty = lane.getAttribute("data-lane");
        if (lanePriorty === priority)
            lane.appendChild(ticket);
    });
}

function saveToLocalStorage() {
    localStorage.setItem("tickets", JSON.stringify(ticketsArr));
}

window.addEventListener("DOMContentLoaded", () => {
    ticketsArr.forEach((taskObj) => {
        createTaskCard(taskObj);
    });
    displayTicketCount();

});

function displayTicketCount() {
    const veryHighCount = ticketsArr.filter((ticket) => ticket.priority === "veryHigh").length;
    const highCount = ticketsArr.filter((ticket) => ticket.priority === "high").length;
    const mediumCount = ticketsArr.filter((ticket) => ticket.priority === "medium").length;
    const lowCount = ticketsArr.filter((ticket) => ticket.priority === "low").length;
    console.log(veryHighCount, highCount, mediumCount, lowCount);
    document.getElementById("veryHighCount").innerText = "(" + veryHighCount + ")";
    document.getElementById("highCount").innerText = "(" + highCount + ")";
    document.getElementById("mediumCount").innerText = "(" + mediumCount + ")";
    document.getElementById("lowCount").innerText = "(" + lowCount + ")";
}

function showToast(message) {
    toast.innerText = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}