import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

const deriveKey = promisify(scrypt);

export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const derived = await deriveKey(password, salt, 64);
  return `${salt}:${derived.toString('hex')}`;
}

export async function verifyPassword(password, storedHash) {
  if (typeof storedHash !== 'string') return false;
  const [salt, hash] = storedHash.split(':');
  if (!salt || !/^[a-f0-9]{128}$/i.test(hash || '')) return false;

  const actual = await deriveKey(password, salt, 64);
  return timingSafeEqual(actual, Buffer.from(hash, 'hex'));
}

export function generateToken(user) {
  const secret = process.env.JWT_SECRET || 'tu_clave_secreta_jwt_tramites_paysandu_2026';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
      rol: user.rol
    },
    secret,
    { expiresIn }
  );
}

export async function registerUser({ username, email, password, rol }) {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new Error('Ya existe un usuario con este correo electrónico');
  }

  const hashedPassword = await hashPassword(password);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    rol: rol || 'ADMIN'
  });

  return {
    id: user._id,
    username: user.username,
    email: user.email,
    rol: user.rol
  };
}

export async function loginUser(email, password) {
  const user = await User.findOne({ email, activo: true }).select('+password');
  if (!user) {
    throw new Error('Credenciales inválidas');
  }

  const isMatch = await verifyPassword(password, user.password);
  if (!isMatch) {
    throw new Error('Credenciales inválidas');
  }

  const token = generateToken(user);

  return {
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      rol: user.rol
    }
  };
}
