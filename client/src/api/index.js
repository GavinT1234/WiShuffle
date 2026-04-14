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

    if (endpoint === '/auth/me' && response.status === 401) {
      throw new Error('Unauthorized');
    }

    if (response.status === 401) {
      if (localStorage.getItem("token")) {
        localStorage.removeItem("token");


        const publicPaths = ['/login', '/register', '/'];
        if (!publicPaths.includes(window.location.pathname)) {
          window.location.href = '/login';
        }
      }
    }

    const text = await response.text();

    if (!text) {
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      return null;
    }

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
