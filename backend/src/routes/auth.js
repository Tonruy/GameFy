// routes/auth.js → base /api/auth

// Públicos (sin middleware):

// POST /register

// POST /login

// POST /recover-password (si lo tienes)

// POST /refresh ✅ (este NO necesita authToken si el refresh se manda en body; se valida en services/token.js)

// Protegido (opcional):

// POST /logout (si quieres cerrar sesión “cliente-side” basta; si lo haces server-side, puedes protegerlo con access token)