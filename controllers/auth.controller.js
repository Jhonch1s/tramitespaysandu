import { registerUser, loginUser } from '../services/auth.service.js';

export async function register(req, res) {
  try {
    const { username, email, password, rol } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email y password son obligatorios'
      });
    }

    const user = await registerUser({ username, email, password, rol });
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y password son requeridos'
      });
    }

    const result = await loginUser(email, password);
    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: result
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
}

export async function profile(req, res) {
  res.json({
    success: true,
    data: req.user
  });
}
