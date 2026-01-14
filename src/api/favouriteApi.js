import { apiFetch } from "./http";

export function getMyFavorites(){
    return apiFetch("/api/favorites");
}

export function addFavorite(bookId){
    return apiFetch("/api/favorites", {
        method: "POST",
        body: JSON.stringify({bookId}),
    });
}

export function removeFavorite(favoriteId){
    return apiFetch(`/api/favorites/${favoriteId}`,{
        method: "DELETE",
    });
}