// routes/auth.js → base /api/auth
//
// Public (no middleware):
// POST /register
// POST /login
// POST /refresh
//
// Protected (optional):
// POST /logout (client-side logout is enough; server-side requires refresh persistence)
//
// NOTE: Spanish comments below are kept because existing comments must not be removed.

const express = require('express');
const router = express.Router();

const { register, login, refresh } = require('../controllers/auth');

// POST /register
router.post('/register', register);

// POST /login
router.post('/login', login);

// POST /refresh
router.post('/refresh', refresh);

module.exports = router;

// Protegido (opcional):

// POST /logout (si quieres cerrar sesión “cliente-side” basta; si lo haces server-side, puedes protegerlo con access token)