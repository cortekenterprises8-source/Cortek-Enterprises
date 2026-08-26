# Cortek architecture

## Current application

Cortek is a Vite React single-page application. The customer catalog, admin dashboard, and sales portal currently share one React context backed by mock phone data. The previous role hash and localStorage inventory are presentation-only and are not security boundaries.

## Target boundary

The PostgreSQL schema in `db/migrations/001_initial.sql` separates products from physical inventory units and models inspections, reservations, customers, sales, users, device verification requests, and audit logs. Inventory mutations must execute through API transactions; the browser must never be the source of truth.

The API currently exposes a database-backed health check and read-only product listing. Authentication and mutation routes are intentionally not represented as client-side role switches: they must be added behind server-side session/JWT verification before privileged screens are connected.

## Device verification

IMEI input is a request for an internal record or configured provider result. The UI must not claim a device is genuine or factory verified when no provider result exists. `verification_status = unavailable` is the honest state when no provider is configured.

## Deployment

The existing deployment shape is static Vite output. The target deployment requires a separate Node API process and managed PostgreSQL instance, with `DATABASE_URL`, `APP_ORIGIN`, `DATABASE_SSL`, and authentication secrets supplied by the deployment environment.
