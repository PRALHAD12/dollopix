# Dollopix Docker + Neon

This repo is dockerized for two targets:
- Local development against Neon Local (ephemeral branches per container lifecycle).
- Production against your Neon cloud database (no local proxy).

## Prerequisites
- Docker and Docker Compose
- Neon account with an API key and project ID

## Local development with Neon Local
1. Copy `.env.development` and fill in values for `NEON_API_KEY`, `NEON_PROJECT_ID`, and `PARENT_BRANCH_ID` (or set `BRANCH_ID` to pin to an existing branch). The file already points `DATABASE_URL` at the Neon Local proxy service.
2. Start the stack:

   ```sh
   docker compose -f docker-compose.dev.yml up --build
   ```

   - `neon-local` creates an ephemeral branch from `PARENT_BRANCH_ID` (deleted on stop when `DELETE_BRANCH=true`).
   - The app container runs `npm run dev` with live reload and connects to Postgres at `postgres://neon:npg@neon-local:5432/dollopix?sslmode=require`.
3. Run Drizzle migrations (optional):

   ```sh
   docker compose -f docker-compose.dev.yml run --rm app npm run db:migrate
   ```

## Production with Neon cloud
1. Set `.env.production` with your Neon cloud `DATABASE_URL` (e.g., `postgres://user:password@project-id.neon.tech/dbname?sslmode=require`).
2. Build and start the app (no Neon Local proxy is started):

   ```sh
   docker compose -f docker-compose.prod.yml up --build -d
   ```

## How env switching works
- `DATABASE_URL` is the single source for Drizzle and the Neon driver (see [src/config/database.js](src/config/database.js)).
- In development, `NEON_LOCAL=true` plus `NEON_LOCAL_PROXY_HOST`/`NEON_LOCAL_PROXY_PORT` reconfigure `@neondatabase/serverless` to talk to the Neon Local HTTP proxy.
- In production, omit `NEON_LOCAL`; the app connects directly to the Neon cloud URL from `.env.production`.

## Files of interest
- [Dockerfile](Dockerfile): multi-stage build (development and production targets).
- [docker-compose.dev.yml](docker-compose.dev.yml): app + Neon Local with ephemeral branches.
- [docker-compose.prod.yml](docker-compose.prod.yml): app only, connects to Neon cloud.
- [.env.development](.env.development): sample Neon Local settings and connection string.
- [.env.production](.env.production): sample Neon cloud connection string.
- [.dockerignore](.dockerignore): keeps env files and build noise out of images.
