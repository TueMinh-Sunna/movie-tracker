import { apiFetch } from "./client";

export function getPing() {
  return apiFetch("/api/ping");
}