# MERN Mini-CRM

Full-stack mini-CRM with authentication, contacts CRUD, activity logs, and optional CSV export.

## Architecture

- **Backend**: Node.js, Express, MongoDB (Mongoose). REST API with JWT auth, bcrypt password hashing, rate-limited login, pagination, and activity logging.
- **Frontend**: React (Vite), React Router, React Hook Form + Zod. Token in memory and refresh token in cookie; protected routes; contacts dashboard with search/filter and pagination (10 per page).

```
┌─────────────┐     REST + JWT      ┌─────────────┐     Mongoose      ┌─────────────┐
│   React     │ ◄─────────────────► │   Express   │ ◄───────────────► │  MongoDB    │
│   (Vite)    │                     │   (Node)    │                   │             │
└─────────────┘                     └─────────────┘                   └─────────────┘
```

## Setup

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env: set MONGODB_URI, JWT_SECRET, JWT_REFRESH_SECRET
npm install
npm run dev
```

Runs at `http://localhost:5000` by default.

### Frontend

```bash
cd frontend
npm install
# For local dev with proxy to backend:
npm run dev
```

Runs at `http://localhost:3000`. Set `VITE_API_URL` if the API is on another origin (e.g. `http://localhost:5000` for same-origin without proxy).

## API Overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | No | Register (email, password, name) |
| POST | `/api/auth/signin` | No | Login (email, password). Rate limit: 3 per 10 min |
| POST | `/api/auth/refresh` | No | Body: `{ refreshToken }`. Returns new access + refresh |
| GET | `/api/auth/me` | Bearer | Current user |
| GET | `/api/contacts` | Bearer | List contacts. Query: `page`, `limit=10`, `search`, `status` |
| GET | `/api/contacts/logs` | Bearer | Activity logs. Query: `page` |
| GET | `/api/contacts/:id` | Bearer | Single contact |
| POST | `/api/contacts` | Bearer | Create contact |
| PUT | `/api/contacts/:id` | Bearer | Update contact |
| DELETE | `/api/contacts/:id` | Bearer | Delete contact |

Contact body: `name`, `email`, `phone?`, `company?`, `status?` (Lead|Prospect|Customer), `notes?`.

## Deployment

- **Backend**: Deploy to Render, Railway, or similar. Set env: `MONGODB_URI` (e.g. Atlas), `JWT_SECRET`, `JWT_REFRESH_SECRET`, `PORT`, `FRONTEND_URL` (for CORS).
- **Frontend**: Build with `npm run build` and deploy the `dist` folder to Vercel, Netlify, or static host. Set `VITE_API_URL` to the live backend API URL.

## Repositories

- Backend: (add your backend repo URL)
- Frontend: (add your frontend repo URL)

## Postman

Import `postman/CRM-API.postman_collection.json` and set collection variable `baseUrl` to your API base URL (e.g. `http://localhost:5000`). Use “Sign up” then “Sign in”, copy `accessToken` into the collection variable `accessToken` for protected requests.
