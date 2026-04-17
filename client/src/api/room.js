import api from './index.js'

export const getAllRooms = () => api.get("/rooms");