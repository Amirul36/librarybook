export function getToken() {
  return localStorage.getItem("token");
}

function logoutAndRedirect() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
    localStorage.removeItem("userName");

    window.location.replace("/login");
  }

  export async function apiFetch(path, options = {}) {
    const token = getToken();

    const headers = {
      "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  //attach token if available
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(path, { ...options, headers });

  //try parse json (even for errors)
  const data = await res.json().catch(() => ({}));

  //auto logout if missinb or invalid token
  if (res.status === 401 && token && !path.startsWith("/api/auth/")) {
    logoutAndRedirect();
    throw new Error("Session expired. Please log in again.");
  }

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}
