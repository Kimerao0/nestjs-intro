# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A task management REST API built with NestJS 11, TypeORM, and PostgreSQL. Features task CRUD operations with status workflow, label management, and user authentication infrastructure.

## Commands

```bash
# Development
npm run start:dev          # Start with watch mode (live reload)
npm run start:debug        # Debug mode with breakpoint support

# Building
npm run build              # Compile TypeScript to JavaScript
npm run start:prod         # Run compiled dist/main.js

# Testing
npm run test               # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:cov           # Run tests with coverage
npm run test:e2e           # Run end-to-end tests

# Code Quality
npm run lint               # ESLint with auto-fix
npm run format             # Prettier formatting
```

## Architecture

### Module Structure

- **AppModule** - Root module orchestrating all feature modules
- **TasksModule** - Task CRUD, status workflow (OPEN → IN_PROGRESS → DONE), label management
- **UsersModule** - User management with password hashing (bcrypt)

### Key Patterns

- **Repository pattern** via TypeORM `@InjectRepository()`
- **DTO validation** using class-validator with global ValidationPipe (`transform: true, whitelist: true`)
- **Configuration** using `@nestjs/config` with Joi schema validation and typed `TypedConfigService`
- **Custom exceptions** (e.g., `WrongStatusException`) converted to HTTP exceptions in controllers

### Entity Relationships

```
User (1) ──→ (N) Task (1) ──→ (N) TaskLabel
```

- Tasks have enforced status progression
- TaskLabels cascade delete with their parent Task
- TaskLabel name must be unique per task

## Environment Variables

Required in `.env`:

```
DB_USER=postgres
DB_PASSWORD=postgres
DB_DATABASE=tasks
JWT_SECRET=<secret>
```

Optional (with defaults):

```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_SYNC=1
JWT_EXPIRES_IN=60m
```

## Database

PostgreSQL via docker-compose:

```bash
docker-compose up -d
```

## Testing

- Unit tests: `*.spec.ts` files alongside source
- E2E tests: `test/*.e2e-spec.ts` using supertest
- Test config: `jest.config.ts` and `test/jest-e2e.json`
- **No comments in test files**

# Memory: Testing style for NestJS services (Jest + TypeScript)

## Core testing goals

- Prefer tests that validate **observable behavior** over internal implementation details.
- Mock external dependencies when they are slow/flaky (e.g., bcrypt), but avoid assertions that hardcode internal constants unless those constants are part of the public contract.
- Every unit under test should have:
  - a “happy path” test
  - at least one “unhappy/error path” test
  - argument-forwarding verification when it’s meaningful

## Jest mocking conventions (TypeScript)

- When mocking modules, use type-safe patterns:
  - `jest.mock('module')`
  - `const mocked = jest.mocked(moduleImport)`
- Avoid `as never` casts. Prefer:
  - `const fn = mocked.fn as jest.MockedFunction<typeof realFn>`
  - or `mocked.fn.mockResolvedValue(...)` when typings allow without unsafe casts
- Reset mocks per test using `jest.resetAllMocks()` or `jest.clearAllMocks()` (choose one and be consistent).
  - Use `resetAllMocks` if prior mock implementations might leak across tests.

## NestJS testing approach

- If the service has **no injected dependencies**, instantiate directly (`new Service()`), don’t spin up a Nest `TestingModule`.
- If the service uses DI/config/loggers/etc., use `Test.createTestingModule` and provide mocks.

## What to assert for thin wrapper services

- Assert the returned value is correctly passed through.
- Assert the dependency is called with correct arguments, but:
  - Do **not** duplicate internal constants (e.g., SALT_ROUNDS) in the test unless exported/configured.
  - If the constant is internal, assert with `expect.any(Number)` or another resilient matcher.
- Prefer expressive matchers:
  - `toHaveBeenCalledTimes(1)` for functions expected to be called once.
  - `toHaveBeenCalledWith(...)` for argument forwarding.

## Error-path coverage

- Add tests that ensure errors from dependencies are **propagated** (or handled) intentionally.
  - Example: bcrypt.hash rejects → service.hash rejects with same error.
  - Example: bcrypt.compare rejects → service.verify rejects with same error.
- Use `await expect(promise).rejects.toThrow(...)` and avoid try/catch in tests.

## Test structure and naming

- Use `describe` blocks per method.
- Use test names that describe outcome/contract:
  - “returns hashed value”
  - “forwards args to bcrypt.hash”
  - “propagates bcrypt errors”
- Keep arrange/act/assert visually separated with blank lines.

## Recommended minimum test set for Password-like services

- `hash`:
  - calls dependency with password + numeric salt rounds (resilient matcher)
  - returns hashed string
  - propagates rejection from bcrypt.hash
- `verify`:
  - returns true when compare resolves true
  - returns false when compare resolves false
  - propagates rejection from bcrypt.compare
  - asserts compare called with plain + hashed

## Example patterns to prefer

- Resilient constant assertion:
  - `expect(bcrypt.hash).toHaveBeenCalledWith(password, expect.any(Number))`
- Typed mock function:
  - `const hashMock = mockedBcrypt.hash as jest.MockedFunction<typeof bcrypt.hash>`
  - `hashMock.mockResolvedValue('hash')`

## Avoid

- Hardcoding private constants in tests (e.g., `10`) unless exported.
- Excessive mocking that recreates implementation details.
- Using Nest `TestingModule` when the class is a plain TypeScript object.

### Methods

- Always write public method explicitly as public
