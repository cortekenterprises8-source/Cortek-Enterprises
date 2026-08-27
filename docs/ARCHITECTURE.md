# Cortek architecture

## Current application

Cortek is a Vite React application served by Express. The customer catalog, admin dashboard, and sales portal share one React cache backed by the PostgreSQL API. Seed fixtures are initialization data only; production inventory never falls back to mock data.

## Target boundary

The PostgreSQL schema in `db/migrations/001_initial.sql` separates products from physical inventory units and models inspections, reservations, customers, sales, users, device verification requests, and audit logs. Inventory mutations must execute through API transactions; the browser must never be the source of truth.

Products and physical inventory units have separate IDs. Reservation, sale, inspection, and status mutations must target the inventory-unit ID and be confirmed by the API before the client refreshes its cache. Privileged routes remain protected by server-side JWT/RBAC checks.

## Device verification

IMEI input is a request for an internal record or configured provider result. The UI must not claim a device is genuine or factory verified when no provider result exists. `verification_status = unavailable` is the honest state when no provider is configured.

## Deployment

The deployment uses the Docker Node process to serve the Vite output and API against managed PostgreSQL. Uploaded files currently use the local filesystem and require a persistent volume or object-storage provider in production; they must not be treated as durable media without that configuration.

Accessories, educational videos, checklists, and testimonials are static merchandising/content fixtures, not inventory records and must not be presented as stock or purchase state.
