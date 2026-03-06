import {
  deleteTask,
  toggleTaskStatus,
  editTitleTask,
} from "./services/ToDo.service.js";

export function ToDoItem(task, { onDelete, onToggle, onEdit }) {
  const li = document.createElement("li");
  li.dataset.id = task.id;
  li.className = `
    group flex items-center gap-3 px-4 py-3
    bg-white border border-stone-200 rounded-xl
    shadow-sm hover:shadow-md transition-all duration-200
    ${task.completed ? "opacity-60" : ""}
  `.trim();

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.className = `
    w-5 h-5 rounded-md border-stone-300 cursor-pointer shrink-0
    accent-stone-600 transition-all duration-150
  `.trim();

  checkbox.addEventListener("change", async () => {
    checkbox.disabled = true;
    try {
      await toggleTaskStatus(task.id);
      onToggle?.();
    } catch (err) {
      console.error(err);
      checkbox.checked = !checkbox.checked;
    } finally {
      checkbox.disabled = false;
    }
  });

  const titleSpan = document.createElement("span");
  titleSpan.textContent = task.title;
  titleSpan.className = `
    flex-1 text-stone-700 text-sm font-medium leading-snug
    cursor-text select-none
    ${task.completed ? "line-through text-stone-400" : ""}
  `.trim();

  const input = document.createElement("input");
  input.type = "text";
  input.value = task.title;
  input.className = `
    flex-1 text-stone-700 text-sm font-medium leading-snug
    border-b-2 border-stone-400 outline-none bg-transparent
    hidden
  `.trim();

  let editing = false;

  const enterEditMode = () => {
    if (task.completed) return;
    editing = true;
    titleSpan.classList.add("hidden");
    input.classList.remove("hidden");
    input.focus();
    input.select();
    confirmBtn.classList.remove("hidden");
    deleteBtn.classList.add("hidden");
  };

  const exitEditMode = (save) => {
    editing = false;
    titleSpan.classList.remove("hidden");
    input.classList.add("hidden");
    confirmBtn.classList.add("hidden");
    deleteBtn.classList.remove("hidden");
    if (!save) input.value = task.title;
  };

  titleSpan.addEventListener("dblclick", enterEditMode);
  titleSpan.title = task.completed ? "" : "Doble click para editar";

  const confirmBtn = document.createElement("button");
  confirmBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="2.5"
      stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>`;
  confirmBtn.className = `
    hidden shrink-0 p-1.5 rounded-lg text-emerald-600
    hover:bg-emerald-50 transition-colors duration-150
  `.trim();
  confirmBtn.title = "Confirmar";

  const saveEdit = async () => {
    const newTitle = input.value.trim();
    if (!newTitle || newTitle === task.title) {
      exitEditMode(false);
      return;
    }
    confirmBtn.disabled = true;
    try {
      await editTitleTask(task.id, { title: newTitle });
      task.title = newTitle;
      titleSpan.textContent = newTitle;
      exitEditMode(true);
      onEdit?.();
    } catch (err) {
      console.error(err);
      exitEditMode(false);
    } finally {
      confirmBtn.disabled = false;
    }
  };

  confirmBtn.addEventListener("click", saveEdit);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveEdit();
    if (e.key === "Escape") exitEditMode(false);
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14H6L5 6"/>
      <path d="M10 11v6M14 11v6"/>
      <path d="M9 6V4h6v2"/>
    </svg>`;
  deleteBtn.className = `
    shrink-0 p-1.5 rounded-lg text-stone-400
    opacity-0 group-hover:opacity-100
    hover:text-red-500 hover:bg-red-50
    transition-all duration-150
  `.trim();
  deleteBtn.title = "Eliminar tarea";

  deleteBtn.addEventListener("click", async () => {
    deleteBtn.disabled = true;
    li.style.opacity = "0.4";
    try {
      await deleteTask(task.id);
      li.remove();
      onDelete?.();
    } catch (err) {
      console.error(err);
      deleteBtn.disabled = false;
      li.style.opacity = "";
    }
  });

  li.append(checkbox, titleSpan, input, confirmBtn, deleteBtn);
  return li;
}
