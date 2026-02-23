# MERN CRM – Backend

Express + MongoDB API: auth (JWT, bcrypt, refresh, login rate limit), contacts CRUD with pagination, search/filter, activity logs.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and set:
   - `MONGODB_URI` – MongoDB connection string
   - `JWT_SECRET`, `JWT_REFRESH_SECRET` – secrets for access and refresh tokens
   - `PORT` (default 5000)
   - `FRONTEND_URL` – for CORS (optional)
3. `npm run dev` – start dev server

## Scripts

- `npm run dev` – run with watch
- `npm start` – production run

## Structure

- `src/config` – DB connection
- `src/models` – User, Contact, ActivityLog
- `src/controllers` – auth, contacts
- `src/routes` – auth, contacts (protected)
- `src/middleware` – auth, rate limit, validation, error handler

## Optional: Docker

```bash
docker build -t crm-backend .
docker run -p 5000:5000 -e MONGODB_URI=... -e JWT_SECRET=... -e JWT_REFRESH_SECRET=... crm-backend
```
