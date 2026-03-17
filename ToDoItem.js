import {
  deleteTask,
  toggleTaskStatus,
  editTitleTask,
} from "./services/ToDo.service.js";

export function ToDoItem(task, { onDelete, onToggle, onEdit }) {
  const li = document.createElement("li");
  li.dataset.id = task.id;
  li.className = [
    "group flex items-center gap-3 px-4 py-3",
    "bg-white border border-stone-200 rounded-xl",
    "shadow-sm hover:shadow-md transition-all duration-200",
    task.completed ? "opacity-60" : "",
  ].join(" ");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.className =
    "w-5 h-5 rounded-md border-stone-300 cursor-pointer shrink-0 accent-stone-600 transition-all duration-150";

  checkbox.addEventListener("change", async () => {
    checkbox.disabled = true;
    try {
      await toggleTaskStatus(task.id);
      const nowCompleted = checkbox.checked;
      task.completed = nowCompleted;

      li.classList.toggle("opacity-60", nowCompleted);
      titleSpan.classList.toggle("line-through", nowCompleted);
      titleSpan.classList.toggle("text-stone-400", nowCompleted);
      titleSpan.title = nowCompleted ? "" : "Doble click para editar";

      onToggle?.(nowCompleted, li);
    } catch (err) {
      console.error(err);
      checkbox.checked = !checkbox.checked;
    } finally {
      checkbox.disabled = false;
    }
  });

  const titleSpan = document.createElement("span");
  titleSpan.textContent = task.title;
  titleSpan.className = [
    "flex-1 text-stone-700 text-sm font-medium leading-snug cursor-text select-none",
    task.completed ? "line-through text-stone-400" : "",
  ].join(" ");
  titleSpan.title = task.completed ? "" : "Doble click para editar";

  const editWrapper = document.createElement("div");
  editWrapper.className = "flex-1 hidden flex-col gap-0.5";

  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.value = task.title;
  editInput.className =
    "w-full text-stone-700 text-sm font-medium leading-snug border-b-2 border-stone-400 outline-none bg-transparent";

  editWrapper.append(editInput);

  const enterEditMode = () => {
    if (task.completed) return;
    titleSpan.classList.add("hidden");
    editWrapper.classList.remove("hidden");
    editWrapper.classList.add("flex");
    editInput.focus();
    editInput.select();
    confirmBtn.classList.remove("hidden");
    deleteBtn.classList.add("hidden");
  };

  const exitEditMode = (save = false) => {
    titleSpan.classList.remove("hidden");
    editWrapper.classList.add("hidden");
    editWrapper.classList.remove("flex");
    confirmBtn.classList.add("hidden");
    deleteBtn.classList.remove("hidden");
    if (!save) editInput.value = task.title;
  };

  titleSpan.addEventListener("dblclick", enterEditMode);

  const confirmBtn = document.createElement("button");
  confirmBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" stroke-width="2.5"
    stroke-linecap="round" stroke-linejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>`;
  confirmBtn.className =
    "hidden shrink-0 self-start p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors duration-150";
  confirmBtn.title = "Confirmar";

  const saveEdit = async () => {
    const newTitle = editInput.value.trim();

    if (newTitle === task.title) {
      exitEditMode(false);
      return;
    }

    if (!newTitle) {
      exitEditMode(false);
      return;
    }

    confirmBtn.disabled = true;
    try {
      const updated = await editTitleTask(task.id, { title: newTitle });
      task.title = updated.title;
      titleSpan.textContent = updated.title;
      editInput.value = updated.title;
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
  editInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveEdit();
    if (e.key === "Escape") exitEditMode(false);
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4h6v2"/>
  </svg>`;
  deleteBtn.className = [
    "shrink-0 self-start p-1.5 rounded-lg text-stone-400",
    "opacity-0 group-hover:opacity-100",
    "hover:text-red-500 hover:bg-red-50",
    "transition-all duration-150",
  ].join(" ");
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

  li.append(checkbox, titleSpan, editWrapper, confirmBtn, deleteBtn);
  return li;
}
