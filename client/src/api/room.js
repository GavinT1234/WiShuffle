import { request } from "./index";

export const getAllRooms = async () => {
  const response = await request("/rooms/");
  console.log(response);
  return response;
};
