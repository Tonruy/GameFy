# GameFy

<p align="left">
  <strong>Discover, search, and track video games with a modern full-stack app powered by IGDB.</strong>
</p>

GameFy is a full-stack web application developed by Antonio Ruiz where users can browse trending and upcoming games, explore details, and manage a personal profile with favorites.

## Highlights

- Real-time game discovery (`Trending`, `Incoming`, `Top Rated`, `Discover`, `New Releases`)
- Fast header search with suggestions
- Detailed game pages with screenshots, trailers, and similar titles
- Dynamic catalogs by genre and platform (with pagination)
- JWT-based authentication (register/login)
- User dashboard (profile update and account deletion)
- Favorites system synced with user account

## Tech Stack

| Layer | Stack |
| --- | --- |
| Frontend | React 19, React Router, Vite, ESLint |
| Backend | Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs |
| External APIs | Twitch OAuth + IGDB |
| Testing | Jest + Supertest |

## Project Structure

```text
GAMEFY/
  backend/
    src/
  frontend/
    src/
```

## Prerequisites

- Node.js 20+
- npm
- MongoDB instance (local or Atlas)
- Twitch Developer credentials for IGDB access

## Environment Variables

### Backend: `backend/.env`

```env
PORT=3001
MONGO_URI=mongodb+srv://...
TWITCH_CLIENT_ID=your_twitch_client_id
TWITCH_CLIENT_SECRET=your_twitch_client_secret
IGDB_BASE_URL=https://api.igdb.com/v4
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=60m
```

### Frontend: `frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:3001
```

## Getting Started

### 1. Run the backend

```bash
cd backend
npm install
npm run dev
```

Backend default URL: `http://localhost:3001`  
Health endpoint: `GET http://localhost:3001/health`

### 2. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend default URL: `http://localhost:5173`

## Scripts

### Backend

- `npm run dev` -> start with nodemon
- `npm start` -> start production-like server
- `npm test` -> run backend tests
- `npm run seed:users` -> seed users

### Frontend

- `npm run dev` -> start Vite dev server
- `npm run build` -> build for production
- `npm run preview` -> preview production build
- `npm run lint` -> run ESLint

## API Overview

### Public routes

- `GET /api/games/trending`
- `GET /api/games/new`
- `GET /api/games/incoming`
- `GET /api/games/discover`
- `GET /api/games/top-rated`
- `GET /api/games/search?searchQuery=...`
- `GET /api/games/:gameId`
- `GET /api/games/:gameId/similar`
- `GET /api/games/genre/:genreId`
- `GET /api/games/platform/:platformId`
- `GET /api/catalog/genres`
- `GET /api/catalog/platforms`
- `POST /api/auth/register`
- `POST /api/auth/login`

### Protected routes (`auth-token` header required)

- `GET /api/users/me`
- `PATCH /api/users/me`
- `DELETE /api/users/me`
- `GET /api/users/me/favorites`
- `POST /api/users/me/favorites/:gameId`
- `DELETE /api/users/me/favorites/:gameId`
- `GET /api/users/me/wishlist`
- `POST /api/users/me/wishlist/:gameId`
- `DELETE /api/users/me/wishlist/:gameId`

## Notes

- CORS is currently configured for `http://localhost:5173`.
- Frontend stores auth tokens in localStorage:
  - `gamefy_access_token`
  - `gamefy_refresh_token`

