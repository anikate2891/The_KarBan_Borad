let taskObj = {};

const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");

const navbtn = document.querySelector(".nav-btn");
const modal = document.querySelector(".modal");
const modalbg = document.querySelector(".bg");
const addNewTaskBtn = document.querySelector("#add-new-task");

let dragElement = null;

/* -------------------- HELPERS -------------------- */

function createTask(title, desc) {
  const div = document.createElement("div");
  div.className = "task";
  div.draggable = true;

  div.innerHTML = `
    <h2>${title}</h2>
    <p>${desc}</p>
    <button class="task_btn">Delete</button>
  `;

  // drag
  div.addEventListener("dragstart", () => {
    dragElement = div;
  });

  // delete
  div.querySelector(".task_btn").addEventListener("click", () => {
    div.remove();
    updateCounts();
  });

  return div;
}

function updateCounts() {
  [todo, progress, done].forEach((box) => {
    const tasks = box.querySelectorAll(".task");
    box.querySelector(".heading .right").innerText = tasks.length;

    taskObj[box.id] = Array.from(tasks).map((t) => ({
      title: t.querySelector("h2").innerText,
      desc: t.querySelector("p").innerText,
    }));
  });

  localStorage.setItem("tasks", JSON.stringify(taskObj));
}

function addDragHover(box) {
  box.addEventListener("dragover", (e) => {
    e.preventDefault();
    box.classList.add("hover-over");
  });

  box.addEventListener("dragleave", () => {
    box.classList.remove("hover-over");
  });

  box.addEventListener("drop", (e) => {
    e.preventDefault();
    if (!dragElement) return;

    box.appendChild(dragElement);
    dragElement = null;
    box.classList.remove("hover-over");
    updateCounts();
  });
}

/* -------------------- LOAD FROM localStorage -------------------- */

if (localStorage.getItem("tasks")) {
  taskObj = JSON.parse(localStorage.getItem("tasks"));

  Object.keys(taskObj).forEach((status) => {
    taskObj[status].forEach((t) => {
      const task = createTask(t.title, t.desc);
      document.getElementById(status).appendChild(task);
    });
  });

  updateCounts();
}

/* -------------------- EVENTS -------------------- */

navbtn.addEventListener("click", () => {
  modal.classList.add("modal-active");
});

modalbg.addEventListener("click", () => {
  modal.classList.remove("modal-active");
});

addNewTaskBtn.addEventListener("click", () => {
  let title = document.querySelector("#task-input").value;
  let desc = document.querySelector("#task-textarea").value;

  if (!title) return;

  const task = createTask(title, desc);
  todo.appendChild(task);

  updateCounts();
  modal.classList.remove("modal-active");

  title = document.querySelector("#task-input").value = '';
  desc = document.querySelector("#task-textarea").value = '';
});

/* -------------------- DRAG TARGETS -------------------- */

addDragHover(todo);
addDragHover(progress);
addDragHover(done);
