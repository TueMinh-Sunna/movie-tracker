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
    let errorData = {
      status: response.status,
      message: `Request failed: ${response.status}`,
      validationErrors: null,
    };

    if (contentType && contentType.includes("application/json")) {
      const errorBody = await response.json();

      errorData = {
        status: response.status,
        message: errorBody.message || errorData.message,
        validationErrors: errorBody.validationErrors || null,
      };
    } else {
      const errorText = await response.text();

      if (errorText) {
        errorData.message = errorText;
      }
    }

    throw errorData;
  }

  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}