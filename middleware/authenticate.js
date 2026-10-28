import jwt from 'jsonwebtoken';

export default function authenticate(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Token de autorización requerido. Use el formato: Bearer <token>'
    });
  }

  const token = authorization.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET || 'tu_clave_secreta_jwt_tramites_paysandu_2026';
    const payload = jwt.verify(token, secret);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
}
