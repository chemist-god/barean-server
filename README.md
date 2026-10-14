# Backend Foundation

Current increment: BOOT-01. Health-only NestJS starter; no authentication, business endpoints, migrations or tenant-isolation proof yet.

## Reproduce the foundation

Use pnpm 10.13.1. The backend .npmrc selects Node 22.23.4; pnpm downloads it if needed. CI selects the same versions. Direct dependency versions and pnpm-lock.yaml are exact/frozen.

From the repository root:

```sh
cd backend
pnpm install --frozen-lockfile
pnpm exec node --version
pnpm check
pnpm start:dev  # compiler watch; in a second terminal: pnpm start:watch
```

Default health URL: http://127.0.0.1:3000/health. HOST defaults to loopback; PORT must be 1–65535. Environment variables are supplied by the shell/process; .env is not loaded automatically. The smoke check starts the built server on a temporary loopback port and stops it afterward.

check runs lint, format validation, source/test typecheck, domain and architecture tests, build and built-server health/absent-business-route smoke checks. CI definition is provided; remote CI success requires an actual run. Tests are bootstrap checks, not database/authorization/security proof.

## Temporary compatibility baseline

NestJS 11/CommonJS uses a patched dependency graph after the original Nest 10 audit failed. TypeScript builds directly without the legacy Nest CLI graph. Unused Prisma 6 packages were removed; the draft schema is retained for supported Prisma selection in DATA-01. No database connection is made during bootstrap.

## Deferred database work

Do not run migrations or SQL proof scripts as part of BOOT-01. DATA-01 requires a reviewed schema and disposable PostgreSQL database. .env.example shows a migration-only credential; it must never become the eventual application runtime role. Authentication, verified tenant context and scoped authorization must precede business endpoints.

See the [first sprint backlog](../docs/responsibility-driven-platform-v0.4/06-architecture-proof/16-first-sprint-backlog.md) and [evidence ledger](../docs/responsibility-driven-platform-v0.4/06-architecture-proof/13-validation-evidence-ledger.md).

## Security overrides

The lockfile pins qs 6.16.1 and multer 2.5.0 to patch audited transitive advisories. minimatch 11.0.1 overrides the ESLint dependency range ^10.2.5 because the advisory has no patched 10 release; this major override is covered by actual lint/config and architecture fixture checks. Reassess/remove overrides when upstream packages incorporate patched versions; rerun full checks and audits after any update. Audit evidence is in evidence/boot-01.
