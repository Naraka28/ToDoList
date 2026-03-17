import { authHeader } from "../auth.js";

const BASE_PATH = "https://taskapi-pjm5.onrender.com";

function jsonHeaders() {
  return {
    "Content-Type": "application/json",
    ...authHeader(),
  };
}

export async function getAll() {
  const response = await fetch(`${BASE_PATH}/tasks`, {
    headers: authHeader(),
  });
  if (!response.ok) {
    console.error(response);
    return;
  }
  return await response.json();
}

export async function create(task) {
  const response = await fetch(`${BASE_PATH}/tasks`, {
    method: "POST",
    headers: jsonHeaders(),
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
    headers: authHeader(),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

export async function deleteAll() {
  const response = await fetch(`${BASE_PATH}/tasks`, {
    method: "DELETE",
    headers: authHeader(),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export async function toggleTaskStatus(id) {
  const response = await fetch(`${BASE_PATH}/tasks/${id}`, {
    method: "PATCH",
    headers: authHeader(),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

export async function editTitleTask(id, title) {
  const response = await fetch(`${BASE_PATH}/tasks/${id}`, {
    method: "PUT",
    headers: jsonHeaders(),
    body: JSON.stringify(title),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}
