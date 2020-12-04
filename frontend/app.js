let tasks;
let toDo = [];
let inProgress = [];
let done = [];
let tables = [tableToDo, tableInProgress, tableDone];
let currentState;

window.addEventListener("load", async () => {
  await renderTask()
});

document.getElementById("addTaskBtn").addEventListener("click", async () => {
  let task = { name: document.getElementById("taskDescription").value, state: currentState };
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
  let tableArrays = [];
  document.getElementById("tableToDo").innerHTML = "";
  document.getElementById("tableInProgress").innerHTML = "";
  document.getElementById("tableDone").innerHTML = "";

  tasks = await getTasks();

  tasks.forEach(task => {
    switch (task.state) {
      case "ToDo":
        toDo.push(task);
        break;
      case "InProgress":
        inProgress.push(task);
        break;
      case "Done":
        done.push(task);
        break;
    }
  });

  createAddButtons();

  tableArrays = [toDo, inProgress, done];

  tableArrays.forEach(tasks => {
    tasks.forEach(task => {
      let tableHTMLId = "table" + task.state;
      let table = document.getElementById(tableHTMLId);
      let div = document.createElement("div");
      let p = document.createElement("p");
      let button = document.createElement("button");

      div.id = task.id;
      div.setAttribute("draggable", "true");
      div.setAttribute("ondragstart", "drag(event)");

      p.innerText = task.name;
      button.innerText = "LÖSCHEN";

      button.addEventListener("click", async () => {
        await deleteTask(task.id);
        window.location.reload(true);
      });

      div.appendChild(p);
      div.appendChild(button);
      table.appendChild(div);
    });
  });
}

function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  event.dataTransfer.setData("text", event.target.id);
}

async function drop(event) {
  event.preventDefault();
  var data = event.dataTransfer.getData("text");
  let dropzone = event.target;
  dropzone.appendChild(document.getElementById(data));

  let newTask;
  let oldTask;
  let tasks = await getTasks();
  tasks.forEach(task => {
    if (task.id == data) {
      newTask = { name: task.name, state: dropzone.id.replace("table", "") };
      oldTask = task;
    }
  });
 
  await deleteTask(oldTask.id);
  await addTask(newTask);
  await renderTask();
  window.reload(true);
}

async function manageTasks(newTask, oldTask) {
}

function createAddButtons() {
  tables.forEach(table => {
    let button = document.createElement("button");
    button.id += table.id.replace("table", "");
    button.className = "btn-add";
    button.innerText = "+";
    buttonClick(button);
    table.appendChild(button);
  });
}

function buttonClick(button) {
  let addTaskPopup = document.getElementById("addTaskPopup");

  button.addEventListener("click", () => {
    addTaskPopup.style.display = "flex";
    currentState = button.id;
  })

  document.getElementById("btn-close").addEventListener("click", () => {
    addTaskPopup.style.display = "none";

    document.getElementById("taskDescription").value = "";
  });

  window.onclick = function (event) {
    if (event.target == addTaskPopup) {
      addTaskPopup.style.display = "none";
      document.getElementById("taskDescription").value = "";
    }
  }
}

async function deleteTask(id) {
  url = "http://localhost:8000/deleteTask/" + id;
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
}