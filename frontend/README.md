# MERN CRM – Frontend

React (Vite) app: Login, Signup, protected Contacts dashboard with pagination (10 per page), search/filter, activity logs, CSV export.

## Setup

1. `npm install`
2. Create `.env` (optional): `VITE_API_URL=http://localhost:5000` if API is on another origin. Leave unset when using Vite proxy to same host.
3. `npm run dev` – dev server at http://localhost:3000 (proxies `/api` to backend when `VITE_API_URL` not set, configure in `vite.config.js`)

## Scripts

- `npm run dev` – dev server
- `npm run build` – production build to `dist/`
- `npm run preview` – serve `dist/`

## Deployment

Build with `npm run build`. Set `VITE_API_URL` to your deployed backend URL before building. Deploy the `dist` folder to Vercel, Netlify, or any static host.
