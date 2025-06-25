const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

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

export const getHistoricalTotals = () => {
  return request("/food-entries/total_history/");
};

export const getFoodEntriesForDate = (date) => {
  // Format date to YYYY-MM-DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  return request(`/food-entries/history/?date=${formattedDate}`);
};
