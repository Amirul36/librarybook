import { apiFetch } from "./http";

export function getMe() {
  return apiFetch("/api/users/me");
}

export function saveInterests(interestCategoryIds) {
  return apiFetch("/api/users/me/interests", {
    method: "PATCH",
    body: JSON.stringify({ interestCategoryIds }),
  });
}