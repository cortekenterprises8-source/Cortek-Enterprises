# Cortek Enterprises

Production retail inventory platform for pre-owned electronics.

## Technology

React, TypeScript, Vite, Express, PostgreSQL, Docker, and Railway.

## Architecture

The Node application serves the Vite frontend and Express API. PostgreSQL is the source of truth for products, physical inventory units, customers, reservations, sales, inspections, images, users, and audit records. Staff access is available at `/login`; the authenticated user role selects the internal admin or sales dashboard.

## Local development

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and provide local values.
3. Start the API with `npm run server:dev`.
4. Start the frontend with `npm run dev`.

## Environment

Required variables are documented in `.env.example`: `DATABASE_URL`, `DATABASE_SSL`, `JWT_SECRET`, `APP_ORIGIN`, `VITE_API_URL`, `PORT`, `UPLOAD_DIR`, and `MAX_FILE_SIZE`. Seeding additionally requires `ADMIN_BOOTSTRAP_PASSWORD` and `SALES_BOOTSTRAP_PASSWORD`.

## Database

Run `npm run db:migrate` to apply and verify the schema. Run `npm run db:seed` only with secure bootstrap password variables configured for the target database.

## Validation

```text
npm run lint
npm test
npm run build
```

## Deployment

Railway uses the repository `Dockerfile`. The image builds the Vite frontend and starts Express with `npm run server:start` against the Railway PostgreSQL service.

Production: https://cortek-enterprises-production.up.railway.app
