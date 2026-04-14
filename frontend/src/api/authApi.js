import { apiFetch } from "./client";

export function registerUser({ username, email, password }) {
  return apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });
}

export function loginUser({ usernameOrEmail, password }) {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      usernameOrEmail,
      password,
    }),
  });
}

export function logoutUser() {
  return apiFetch("/api/auth/logout", {
    method: "POST",
  });
}

export function getCurrentUser() {
  return apiFetch("/api/auth/me");
}