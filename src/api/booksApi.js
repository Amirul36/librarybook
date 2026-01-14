import { apiFetch } from "./http";

export function getCategories() {
  return apiFetch("/api/categories");
}

export function getBooks(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return apiFetch(`/api/books${qs ? `?${qs}` : ""}`);
}

export function getBookById(id) {
  return apiFetch(`/api/books/${id}`);
}

export function getRecommendedBooks() {
  return apiFetch("/api/books/recommended");
}