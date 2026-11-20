// "Portero": deja pasar solo a quien trae un token válido de admin
const jwt = require('jsonwebtoken');

module.exports = function verificarAdmin(req, res, next) {
  const cabecera = req.headers.authorization || ''; // llega como "Bearer <token>"
  const token = cabecera.startsWith('Bearer ') ? cabecera.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'No autorizado' });

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next(); // token correcto: continúa a la ruta
  } catch {
    res.status(401).json({ error: 'Sesión inválida o vencida. Entra de nuevo.' });
  }
};
