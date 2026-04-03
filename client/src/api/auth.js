import { request } from "./index";

export const login = async ({ email, password }) => {
  return await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

export const logout = async () => {
  return await request("/auth/logout", {
    method: "POST",
  });
};

export const register = async ({ username, email, password }) => {
  return await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });
};
