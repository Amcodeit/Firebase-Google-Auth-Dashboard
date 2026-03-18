# Firebase Google Auth Dashboard (React + Vite + Tailwind)

This app implements:

1. React + Vite project with Tailwind CSS.
2. Google login using Firebase Authentication.
3. Protected `/dashboard` route accessible only when logged in.
4. Local session persistence in localStorage with `name`, `email`, and login timestamp.
5. Strict 24-hour session expiry.
6. Session restore on refresh without showing login again when still valid.
7. Logout that clears localStorage and redirects to login.

## 1) Firebase setup

In Firebase Console:

1. Create a project (or use existing).
2. Go to **Authentication > Sign-in method**.
3. Enable **Google** provider.
4. Go to **Project settings > General**, register a Web app, and copy config values.
5. Add your dev domain (for example `localhost`) to **Authentication > Settings > Authorized domains**.

## 2) Environment variables

Copy `.env.example` to `.env` and fill values:

```bash
cp .env.example .env
```

Required variables:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## 3) Run locally

```bash
npm install
npm run dev
```

Build check:

```bash
npm run build
```

## Session behavior

- On successful Google login, app stores `name`, `email`, and `loginAt` in localStorage.
- If the stored session is younger than 24 hours, refresh restores user directly to dashboard.
- At or after 24 hours, session is cleared and user must log in again.
- Logout clears session data and redirects to `/`.
