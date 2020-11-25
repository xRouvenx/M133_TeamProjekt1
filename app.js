var addTaskPopup = document.getElementById("addTaskPopup");

document.querySelectorAll('.btn-add').forEach(x => {
    x.addEventListener('click', () => {
        addTaskPopup.style.display = "block";
    })
});

document.getElementById("btn-close").addEventListener('click', () => {
  addTaskPopup.style.display = "none";
});

window.onclick = function (event) {
  if (event.target == addTaskPopup) {
      addTaskPopup.style.display = "none";
  }
}