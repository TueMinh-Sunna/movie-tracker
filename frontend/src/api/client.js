export async function apiFetch(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const contentType = response.headers.get("content-type");

  if (!response.ok) {
    let errorMessage = `Request failed: ${response.status}`;

    if (contentType && contentType.includes("application/json")) {
      const errorBody = await response.json();
      errorMessage = errorBody.message || errorMessage;
    } else {
      const errorText = await response.text();
      if (errorText) {
        errorMessage = errorText;
      }
    }

    throw new Error(errorMessage);
  }

  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}