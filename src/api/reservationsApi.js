import { apiFetch } from "./http";

export function getMyReservations() {
  return apiFetch("/api/reservations");
}

export function createReservation(bookId) {
  return apiFetch("/api/reservations", {
    method: "POST",
    body: JSON.stringify({ bookId }),
  });
}

export function cancelReservation(reservationId) {
  return apiFetch(`/api/reservations/${reservationId}/cancel`, {
    method: "PATCH",
  });
}

export function completeReservation(reservationId) {
  return apiFetch(`/api/reservations/${reservationId}/complete`, {
    method: "PATCH",
  });
}