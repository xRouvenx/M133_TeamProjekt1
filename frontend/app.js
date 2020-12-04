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
  button.innerHTML = "<img src ='data:image/png;base64,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'/> Löschen"
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