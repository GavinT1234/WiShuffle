import { request } from "./index";

export const getAllRooms = async () => {
  const response = await request("/rooms/");
  console.log(response);
  return response;
};

export const createRoom = async ({ name, tags = [] }) => {
  const response = await request("/rooms/", {
    method: "POST",
    body: JSON.stringify({ name, tags }),
  });
  console.log(response);
  return response;
};
