// routes/users.js → base /api/users

// Protegidos con access token (middleware authToken.js):

// GET /me → devuelve info del usuario logueado

// PATCH /me (opcional) → editar perfil

// Solo admin (authToken + roleCheck):

// GET /:id (opcional)

// GET / (opcional list users)

// 👉 Aquí sí se usa roleCheck.js si hay endpoints admin.