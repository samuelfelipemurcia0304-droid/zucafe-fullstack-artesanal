// Login del administrador: compara con ADMIN_USER y ADMIN_PASS del archivo .env
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/login', (req, res) => {
  const usuario = String(req.body.usuario || '').trim();
  const clave = String(req.body.clave || '').trim();
  const { ADMIN_USER, ADMIN_PASS, JWT_SECRET } = process.env;

  if (!ADMIN_USER || !ADMIN_PASS || !JWT_SECRET) {
    return res.status(500).json({ error: 'Faltan ADMIN_USER, ADMIN_PASS o JWT_SECRET en el .env del servidor' });
  }

  if (usuario === ADMIN_USER && clave === ADMIN_PASS) {
    const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: '8h' });
    return res.json({ token });
  }
  res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
});

module.exports = router;
