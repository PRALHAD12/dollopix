**Dollopix**

Dollopix is a small Node.js/Express API service providing user authentication and user management endpoints. It uses modern middleware for security and logging, Drizzle for database migrations, and includes Docker compose files for development and production.

**Features**
- **Tech stack:** Node.js, Express, Drizzle, Jest
- **Security:** Helmet, CORS, cookie-parser, JWT-based auth
- **Logging:** Morgan logs forwarded to a logger
- **API endpoints:** Auth and Users routes under `/api/auth` and `/api/users`

**Quick Links**
- **Server entry:** [src/app.js](src/app.js)
- **Main start:** [src/index.js](src/index.js)
- **Routes:** [src/routes](src/routes)

**Prerequisites**
- Node.js 18+ (or your project's supported LTS)
- npm or yarn
- PostgreSQL (or the DB configured in `drizzle.config.js`)
- Docker & Docker Compose (optional, for containerized runs)

**Environment Variables**
Create a `.env` file in the project root or provide env vars via your runtime. Typical env vars used by the app:

- `PORT` : port to run the server (default: `3000`)
- `DATABASE_URL` : database connection string
- `JWT_SECRET` : secret used to sign JWT tokens
- `COOKIE_SECRET` : cookie signing secret
- `NODE_ENV` : `development` | `production`

Adjust these to match your deployment environment.

**Install & Run (Local)**
1. Install dependencies:

```
npm install
```

2. Run in development (hot reload if setup with nodemon):

```
npm run dev
```

3. Start in production mode:

```
npm start
```

The app exposes a health endpoint at `/health` and a simple API root at `/api`.

**Docker (Development & Production)**
The repository contains `docker-compose.dev.yml` and `docker-compose.prod.yml`. To run with Docker Compose (development):

```
docker compose -f docker-compose.dev.yml up --build
```

For production deploys use:

```
docker compose -f docker-compose.prod.yml up --build -d
```

**Database Migrations**
This project uses Drizzle for migrations. There's a `migrate.js` script at the repo root. Typical flow (example):

```
node migrate.js up
```

Check `drizzle.config.js` and the `drizzle/` directory for migration files and snapshots.

**Testing**
Run tests with:

```
npm test
```

The project includes Jest config (`jest.config.mjs`) and tests under the `test/` folder.

**Linting & Formatting**
- ESLint config is present in `eslint.config.js`. Run linting with your configured npm script (e.g., `npm run lint`).

**Project Structure (high level)**
- `src/` : application source
  - `app.js` : Express app configuration (middleware, routes)
  - `index.js` / `server.js` : server bootstrap
  - `config/` : app configuration (logger, database)
  - `routes/` : route definitions (`auth.routes.js`, `users.routes.js`)
  - `controllers/` : request handlers
  - `service/` : business logic and service layer
  - `models/` : database models
  - `middleware/` : security and auth middleware
  - `validations/` : input validation rules

**API Endpoints (summary)**
- `GET /` : Landing message (Hello from Dollopix!)
- `GET /health` : Health check (status, timestamp, uptime)
- `GET /api` : API status
- `POST /api/auth/*` : Authentication routes (login, register, refresh, logout)
- `GET/POST/PUT/DELETE /api/users/*` : User management endpoints

Refer to `src/routes` and `src/controllers` for exact route shapes and validations.

**Logging**
Requests are logged with `morgan` and forwarded to the configured logger in `src/config/logger.js`.

**Contributing**
- Fork the repo and create feature branches.
- Add tests for new features or bug fixes.
- Open a PR describing changes and rationale.

**Troubleshooting**
- If DB connections fail, verify `DATABASE_URL` and that the DB is reachable.
- If JWT or cookie issues occur, ensure `JWT_SECRET` and `COOKIE_SECRET` are set and consistent across services.

**License**
This project does not include a license file by default. Add a `LICENSE` file if you plan to open-source the project.

---

If you'd like, I can also:
- add example `.env.example` with the common env vars
- add a `Makefile` or npm script shortcuts for migrations and docker commands
- expand the API docs with sample requests and response shapes

Tell me which of these you'd prefer next.
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







    


