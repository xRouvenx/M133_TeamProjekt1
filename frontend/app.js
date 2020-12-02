var tasks;
var toDo = [];
var inProgress = [];
var done = [];

window.addEventListener("load", () => {
  tasks = getTasks();
});

var addTaskPopup = document.getElementById("addTaskPopup");

document.querySelectorAll(".btn-add").forEach(x => {
  x.addEventListener('click', () => {
    addTaskPopup.style.display = "block";
  })
});

document.getElementById("btn-close").addEventListener("click", () => {
  addTaskPopup.style.display = "none";
});

window.onclick = function (event) {
  if (event.target == addTaskPopup) {
    addTaskPopup.style.display = "none";
  }
}

document.getElementById("addTaskBtn").addEventListener("click", async () => {
  let task = { name: document.getElementById("taskDescription").value, state: "toDo" }
  await addTask(task);
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

  toDo.forEach(element => {
    let table = document.getElementById("tableToDo");
    let div = document.createElement("div");
    let p = document.createElement("p");

    p.innerText = element.name;

    div.appendChild(p);
    table.appendChild(div);
  });
}

async function getTasks() {
  let response = await fetch('http://localhost:8000/fetchTask', {
    method: 'GET',
  });
  return await response.json();
}

async function addTask(task) {
  fetch('http://localhost:8000/addTask', {
    method: 'POST',
    body: JSON.stringify(task)
  });
}