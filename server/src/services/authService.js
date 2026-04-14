import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  createUser,
  findUserByEmail,
  findUserByUsername,
  findUserById,
} from '../repositories/userRepo.js';

export async function register(username, email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await createUser({
    username,
    email,
    password: hashedPassword,
  });
  return newUser;
}

export async function login(identifier, password) {
  const JWT_SECRET = process.env.JWT_SECRET;
  const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

  const error = new Error('Invalid credentials');
  error.status = 401;

  // Check if identifier is an email or username
  const isEmail = identifier.includes('@');
  const user = isEmail 
    ? await findUserByEmail(identifier)
    : await findUserByUsername(identifier);
  if (!user) throw error;

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw error;

  const accessToken = jwt.sign({ id: user.id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN || '1d',
  });

  return { user: sanitizeUser(user), accessToken };
}

function sanitizeUser(user) {
  const { password, ...safe } = user;
  return safe;
}

export async function verifyJWT(token) {
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const user = await findUserById(payload.id);
  if (!user) throw new Error('User not found');

  return sanitizeUser(user);
}
