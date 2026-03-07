import { getAll, create, deleteAll } from "./services/ToDo.service.js";
import { ToDoItem } from "./ToDoItem.js";

const form = document.getElementById("todo-form");
const inputField = document.getElementById("todo-input");
const pendingList = document.getElementById("pending-list");
const doneList = document.getElementById("done-list");
const deleteAllBtn = document.getElementById("delete-all-btn");
const emptyPending = document.getElementById("empty-pending");
const emptyDone = document.getElementById("empty-done");
const pendingCount = document.getElementById("pending-count");
const doneCount = document.getElementById("done-count");
const toast = document.getElementById("toast");

let toastTimer;
function showToast(msg, type = "info") {
  toast.textContent = msg;
  toast.className = [
    "fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full",
    "text-sm font-medium shadow-lg transition-all duration-300 z-50",
    type === "error"
      ? "bg-red-100 text-red-700 border border-red-200"
      : "bg-stone-800 text-stone-100",
  ].join(" ");
  toast.style.opacity = "1";
  toast.style.transform = "translateX(-50%) translateY(0)";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(8px)";
  }, 2800);
}
function updateCounters() {
  const pCount = pendingList.querySelectorAll("li").length;
  const dCount = doneList.querySelectorAll("li").length;

  pendingCount.textContent = pCount;
  doneCount.textContent = dCount;

  emptyPending.style.display = pCount ? "none" : "flex";
  emptyDone.style.display = dCount ? "none" : "flex";
}

function onDelete() {
  updateCounters();
}

function onToggle(nowCompleted, li) {
  if (nowCompleted) {
    doneList.prepend(li);
  } else {
    pendingList.prepend(li);
  }
  updateCounters();
}

function onEdit() {}

const callbacks = { onDelete, onToggle, onEdit };

async function render() {
  pendingList.innerHTML = "";
  doneList.innerHTML = "";

  let tasks;
  try {
    tasks = await getAll();
  } catch {
    showToast("Error al cargar las tareas", "error");
    return;
  }

  tasks
    .filter((t) => !t.completed)
    .forEach((t) => pendingList.appendChild(ToDoItem(t, callbacks)));

  tasks
    .filter((t) => t.completed)
    .forEach((t) => doneList.appendChild(ToDoItem(t, callbacks)));

  updateCounters();
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = inputField.value.trim();
  if (!title) return;

  const submitBtn = form.querySelector("button[type=submit]");
  submitBtn.disabled = true;

  try {
    const newTask = await create({ title, completed: false });
    inputField.value = "";

    pendingList.appendChild(ToDoItem(newTask, callbacks));
    updateCounters();
    showToast("Tarea agregada ✓");
  } catch {
    showToast("No se pudo agregar la tarea", "error");
  } finally {
    submitBtn.disabled = false;
  }
});

deleteAllBtn.addEventListener("click", async () => {
  if (
    !confirm(
      "¿Seguro que quieres eliminar todas las tareas? Esta acción no se puede deshacer.",
    )
  )
    return;
  deleteAllBtn.disabled = true;

  try {
    await deleteAll();
    pendingList.innerHTML = "";
    doneList.innerHTML = "";
    updateCounters();
    showToast("Todas las tareas eliminadas");
  } catch {
    showToast("No se pudieron eliminar las tareas", "error");
  } finally {
    deleteAllBtn.disabled = false;
  }
});

render();
