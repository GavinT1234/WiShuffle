import { register, login } from '../services/authService.js';

export async function registerHandler(req, res) {
  const { username, email, password } = req.body;
  const newUser = await register(username, email, password);
  res.status(201).json(newUser);
}

export async function loginHandler(req, res) {
  const { identifier, password } = req.body;
  const accessToken = await login(identifier, password);
  res.status(200).json({ accessToken });
}

export async function meHandler(req, res) {
  res.json(req.user);
}
