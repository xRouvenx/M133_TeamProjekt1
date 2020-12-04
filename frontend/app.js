let tasks;
let toDo = [];
let inProgress = [];
let done = [];
let tables = [tableToDo, tableInProgress, tableDone];
let deleteButtons = [];
let taskToDelete = [];

window.addEventListener("load", async () => {
  await renderTask()
});

document.getElementById("addTaskBtn").addEventListener("click", async () => {
  let task = { name: document.getElementById("taskDescription").value, state: "toDo" }
  let addTaskPopup = document.getElementById("addTaskPopup");
  await addTask(task);
  document.getElementById("taskDescription").value = "";
  addTaskPopup.style.display = "none";
  await renderTask();
});

async function renderTask() {
  toDo = [];
  inProgress = [];
  done = [];
  document.getElementById("tableToDo").innerHTML = "";
  document.getElementById("tableInProgress").innerHTML = "";
  document.getElementById("tableDone").innerHTML = "";

  tasks = await getTasks();

  tasks.forEach(task => {
    switch (task.state) {
      case "toDo":
        toDo.push(task);
        break;
      case "inProgress":
        inProgress.push(task);
        break;
      case "done":
        done.push(task);
        break;
    }
  });

  toDo.forEach(task => {
    let table = document.getElementById("tableToDo");
    let div = document.createElement("div");
    let p = document.createElement("p");
    let button = document.createElement("button");

    p.innerText = task.name;
    button.innerText = "Löschen";

    button.addEventListener("click", async (event) => {
      await deleteTask(task.id);
      window.location.reload(true);
    });

    div.appendChild(p);
    div.appendChild(button);
    table.appendChild(div);
  });

  createAddButtons();
}

function createDeleteButton(button, id) {
  button.innerText = "Löschen";
  button.addEventListener("click", async () => {
    deleteTask(id);
    await renderTask();
  });
}

function createAddButtons() {
  tables.forEach(table => {
    let button = document.createElement("button");
    button.className = "btn-add";
    button.innerText = "+";
    buttonClick(button);
    table.appendChild(button);
  });
}

function buttonClick(button) {
  let addTaskPopup = document.getElementById("addTaskPopup");

  button.addEventListener("click", () => {
    addTaskPopup.style.display = "block";
  })

  document.getElementById("btn-close").addEventListener("click", () => {
    addTaskPopup.style.display = "none";
  });

  window.onclick = function (event) {
    if (event.target == addTaskPopup) {
      addTaskPopup.style.display = "none";
    }
  }
}

async function deleteTask(id) {
  url = "http://localhost:8000/deleteTask/" + id;
  console.log(url);
  fetch(url, {
    method: "DELETE",
  });
}

async function getTasks() {
  let response = await fetch("http://localhost:8000/fetchTask", {
    method: "GET",
  });
  return await response.json();
}

async function addTask(task) {
  fetch("http://localhost:8000/addTask", {
    method: "POST",
    body: JSON.stringify(task)
  });

var startingDropzone;

document.addEventListener("dragstart", function (event) {
    startingDropzone = event.target;
}, false);

document.addEventListener("dragover", function (event) {
    event.preventDefault();
}, false);

function findParentNodeByClass(element, className) {
    while (element.parentNode) {
        if (element.className.includes(className)) {
            return element;
        }
        element = element.parentNode;
    }

    return null;
}

document.addEventListener("drop", async function (event) {
    event.preventDefault();

    var dropzone = findParentNodeByClass(event.target, "dropzone");

    if (dropzone != null) {
        dropzone.style.background = "";
        startingDropzone.parentNode.removeChild(startingDropzone);
        dropzone.insertBefore(startingDropzone, dropzone.firstChild);
        await moveTask({
            id: dropzone.childNodes[0].childNodes[1].innerHTML,
            state: dropzone.id
        });
    }
}, false);

}