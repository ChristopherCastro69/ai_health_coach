const API_BASE_URL = "http://127.0.0.1:8000/api";

/**
 * A helper function to handle API requests and responses.
 * @param {string} endpoint - The API endpoint to call.
 * @param {object} options - Optional fetch options (method, headers, body).
 * @returns {Promise<any>} - The JSON response from the API.
 * @throws {Error} - Throws an error if the network response is not ok.
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({})); // Try to parse error, default to empty object
    const errorMessage =
      errorData.error || `HTTP error! status: ${response.status}`;
    throw new Error(errorMessage);
  }
  return response.json();
}

// --- Model Checking ---

export const checkOllama = () => {
  return request("/check-ollama/");
};

export const checkModel = () => {
  return request("/check-model/");
};
