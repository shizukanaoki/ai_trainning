# Repository Guidelines

## Project Structure & Module Organization
- `frontend/`: React + Vite + TypeScript app.
  - Source: `frontend/src/`
  - Assets: `frontend/public/` and `frontend/src/assets/`
  - Config: `frontend/vite.config.ts`, `frontend/tsconfig.*`, `frontend/eslint.config.js`
- `api/`: Express + TypeScript service.
  - Source: `api/src/`
  - Config: `api/tsconfig.json`
  - Env template: `api/.env.example`
- Root: npm workspaces (`package.json`), lockfile (`package-lock.json`)

## Build, Test, and Development Commands
Run from repo root:
- `npm run dev`: start frontend (Vite)
- `npm run dev:api`: start API (Express + tsx)
- `npm run build`: build both workspaces
- `npm run lint`: lint frontend (ESLint)
- `npm run preview`: preview frontend build

The frontend proxies `/agent` to `http://localhost:3001` via `frontend/vite.config.ts`.

## Coding Style & Naming Conventions
- TypeScript, 2-space indentation, single quotes, no semicolons.
- React functional components with hooks.
- CSS uses BEM-like classes (e.g., `app__header`, `todo-form__input`).
- Linting: ESLint (see `frontend/eslint.config.js`).

## Testing Guidelines
No automated tests are configured. If adding tests, document the framework and add a root script
(`npm run test`) plus a short note here about naming and location (e.g., `**/*.test.ts`).

## Commit & Pull Request Guidelines
Commit messages follow Conventional Commits style seen in history:
`feat(...)`, `refactor(...)`, `chore(...)`.
Keep commits focused and split unrelated changes (e.g., `.serena/` updates separate from code).
For PRs, include a short description, testing notes, and screenshots for UI changes.

## Security & Configuration Tips
- Do not commit secrets. Add real keys to `api/.env` (ignored by git).
- Template lives at `api/.env.example`.
