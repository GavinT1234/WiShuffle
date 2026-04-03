import { request } from "./index";

export const getUser = async () => {
  const response = await request("/auth/me");

  return response;
};
