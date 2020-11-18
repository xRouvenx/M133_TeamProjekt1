function addTodo() {
    const list = document.getElementById("todoList");
    const listItem = document.createElement("li");
    listItem.innerText = "new Item";

    list.appendChild(listItem);
}

function addInProgress() {
    const list = document.getElementById("inProgressList");
    const listItem = document.createElement("li");
    listItem.innerText = "new Item";

    list.appendChild(listItem);
}

function addDone() {
    const list = document.getElementById("doneList");
    const listItem = document.createElement("li");
    listItem.innerText = "new Item";

    list.appendChild(listItem);
}