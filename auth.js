const BASE_PATH = "https://taskapi-pjm5.onrender.com";
const TOKEN_KEY = "todo_jwt";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function isLoggedIn() {
  return !!getToken();
}

function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

export function authHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function login({ email, password }) {
  const response = await fetch(`${BASE_PATH}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (response.status === 401) {
    throw new Error("Credenciales incorrectas.");
  }
  if (!response.ok) {
    throw new Error(`Error del servidor (${response.status}).`);
  }

  const data = await response.json();
  saveToken(data.token);
  return data;
}

export async function register({ name, email, password, age }) {
  const response = await fetch(`${BASE_PATH}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, age }),
  });

  if (response.status === 409) {
    throw new Error("El correo ya está registrado.");
  }
  if (!response.ok) {
    throw new Error(`Error del servidor (${response.status}).`);
  }

  return await response.json();
}
