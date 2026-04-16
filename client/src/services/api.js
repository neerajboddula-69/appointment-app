const apiBase = "http://localhost:4000/api";

export async function api(path, options = {}) {
  const response = await fetch(`${apiBase}${path}`, {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}
