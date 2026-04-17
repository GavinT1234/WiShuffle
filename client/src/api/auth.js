import api from './index.js'

export const loginRequest = (creds) => api.post("/auth/login", creds);