var tasks;

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

document.getElementById("addTaskBtn").addEventListener("click", () => {
  let task = { name: document.getElementById("taskDescription").value, state: "toDo" }
  addTask(task);
});

window.onclick = function (event) {
  if (event.target == addTaskPopup) {
    addTaskPopup.style.display = "none";
  }
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