const BASE_PATH = "https://taskapi-pjm5.onrender.com";

export async function getAll() {
  const response = await fetch(`${BASE_PATH}/tasks`);

  if (!response.ok) {
    console.error(response);
    return;
  }

  return await response.json();
}

export async function create(task) {
  const response = await fetch(`${BASE_PATH}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

export async function deleteTask(id) {
  const response = await fetch(`${BASE_PATH}/tasks/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}
export async function deleteAll() {
  const response = await fetch(`${BASE_PATH}/tasks`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

export async function toggleTaskStatus(id) {
  const response = await fetch(`${BASE_PATH}/tasks/${id}`, {
    method: "PATCH",
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

export async function editTitleTask(id, title) {
  const response = await fetch(`${BASE_PATH}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(title),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}
