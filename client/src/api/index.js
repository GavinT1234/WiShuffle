const BASE_URL = "/api";

export const request = async (endpoint, options = {}) => {
  try {

    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    
    if (response.status === 401) {
      if (localStorage.getItem("token")) {
      window.location.href = "/";
      }
    }

    const text = await response.text();

    const data = JSON.parse(text);

    if (!response.ok) {
      throw new Error(data.error || data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.log("API request error:", error);
    throw error;
  }
};
