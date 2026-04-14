import { register, login } from '../services/authService.js';

export async function registerHandler(req, res, next) {
  try {
    const { username, email, password } = req.body;
    const newUser = await register(username, email, password);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
}

export async function loginHandler(req, res, next) {
  try {
    const { identifier, password } = req.body;
    const accessToken = await login(identifier, password);
    res.status(200).json({ accessToken });
  } catch (error) {
    next(error);
  }
}

export async function meHandler(req, res, next) {
  try {
    res.json(req.user);
  } catch (error) {
    next(error);
  }
}
