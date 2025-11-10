# AI Agent Workflow Log

## Agents Used

- **ChatGPT** — architecture guidance, prompt refinement, debugging, code generation, explanation, test-writing, and iterative fixes.
- **Cursor Agent** — project-level code generation (used `tasks.md` to scaffold backend + frontend, and to generate repository files and seeds).

---

## Prompts & Outputs

> Below are some prompt → output examples from the session.

### Generate entire backend with Cursor (master `tasks.md`)

**Prompt:**
```
Use tasks.md for full context.
Generate the entire backend inside the /backend folder exactly as specified in tasks.md.
Follow the folder structure, Prisma schema, domain logic, ports, adapters, Express controllers, server bootstrap, and tests.
Use TypeScript strict mode and Prisma + PostgreSQL.
Make all code compile-ready.
```

**Generated snippet:**
```ts
// backend/src/adapters/inbound/http/complianceRouter.ts
import { Router } from 'express';
import { z } from 'zod';
import { ComplianceService } from '../../../core/application/complianceService';
import { asyncHandler } from '../../../shared/http';

const complianceQuerySchema = z.object({ routeId: z.string().uuid().optional() }).strict();

export function createComplianceRouter(complianceService: ComplianceService) {
  const router = Router();
  router.get('/cb', asyncHandler(async (req, res) => {
    const parsed = complianceQuerySchema.safeParse(req.query);
    if (!parsed.success) throw new Error(parsed.error.message);
    const result = await complianceService.getCompliance(parsed.data.routeId);
    res.json({ data: result });
  }));
  return router;
}
```

**How I refined it:** After Cursor created the router and schema, I manually reviewed and updated the Zod schema and the expected query parameter name to match the frontend (changing `routeId` usage and informing the frontend to pass `routeId`), and added error-class handling (`ValidationError`) and `asyncHandler` wrappers.

---

### Frontend generation with Cursor (master `tasks.md`)

**Prompt:**
```
Use tasks.md for full context.

Generate the entire frontend inside the /frontend folder exactly as specified in tasks.md.

Requirements:
- React + TypeScript + Vite
- TailwindCSS
- shadcn/ui components
- Recharts for charts
- React Query for data fetching
- Axios for HTTP requests
- Strict Hexagonal Architecture

Backend base URL:
http://localhost:3000/api

Folder structure:
frontend/
  src/
    core/
      domain/
      application/
      ports/
    adapters/
      ui/
      infrastructure/
        api/
    shared/

... (omitted UI feature list for brevity) ...
```

**Generated snippet:**
```ts
// frontend/src/adapters/infrastructure/api/apiClient.ts
// ✅ UPDATED — backend accepts ONLY routeId
async getCB(routeId: string): Promise<ComplianceSummary[]> {
  const response = await this.client.get<{ data: ComplianceSummary[] }>('/compliance/cb', {
    params: { routeId },
  });
  return response.data.data;
}

async getAdjustedCB(routeId: string): Promise<ComplianceSummary[]> {
  const response = await this.client.get<{ data: ComplianceSummary[] }>('/compliance/adjusted-cb', {
    params: { routeId },
  });
  return response.data.data;
}
```

---

### Fix frontend API client to match backend Zod schema

**Prompt:**
```
Replace getCB(year:number) in the frontend API client to call /compliance/cb?routeId=<uuid> instead of year.
Generate the full updated apiClient.ts with the corrected getCB and getAdjustedCB functions.
```

**Generated snippet:**
```ts
// frontend/src/adapters/infrastructure/api/apiClient.ts
export async function getCB(routeId: string): Promise<ComplianceSummary[]> {
  const response = await this.client.get<{ data: ComplianceSummary[] }>('/compliance/cb', {
    params: { routeId },
  });
  return response.data.data;
}
```

**How I refined it:** After inserting the new function, I discovered that the API interface (`core/ports/apiClient.ts`) still declared `getCB(year:number)`. I updated the interface to `getCB(routeId:string)` and aligned all call sites (Banking tab) to pass the baseline route's `id`.

---

### Auto test-runner script (user request → generated test file)

**Prompt:**
```
- *Unit* — ComputeComparison, ComputeCB, BankSurplus, ApplyBanked, CreatePool
- *Integration* — HTTP endpoints via Supertest
- *Data* — Migrations + Seeds load correctly
- *Edge cases* — Negative CB, over-apply bank, invalid pool create a script so that someone can run these tests on my code and test cases are generated automatically
```

**Generated snippet:**
```ts
// backend/tests/auto.test.ts
import {
  computeEnergy,
  computeCB,
  computeComparison,
  bankSurplus,
  applyBanked,
  createPool,
} from "../src/core/application/calculations";
import request from "supertest";
import { prisma } from "../src/infrastructure/db/prismaClient";
import { createApp } from "../src/infrastructure/server/app";

describe("UNIT TESTS — Core Functions", () => {
  it("computeEnergy() should multiply correctly", () => {
    expect(computeEnergy(1)).toBe(41000);
  });

  it("computeCB() should compute CB correctly", () => {
    const result = computeCB(100, 90, 1000);
    expect(result).toBe(10000);
  });

  it("computeComparison() should compute percentDiff", () => {
    const result = computeComparison(100, 110);
    expect(result.percentDiff).toBeCloseTo(10);
    expect(result.compliant).toBe(false);
  });

  // ... additional unit & integration tests follow
});
```

---

## Validation / Corrections

For each AI-generated change I performed structured validation steps and corrections:

1. **Type & interface alignment**
   - Verified TypeScript types and `ApiClient` interface signatures match implementations (common causes of HMR/import errors). When implementations were updated I updated the port interface and import paths.

2. **Runtime validation with the real server**
   - Ran the backend `npm run dev` and verified endpoints using the browser and `curl` / network tab. Example checks:
     - `GET http://localhost:3000/api/routes` → returned seeded routes
     - `GET /api/comparison` and `GET /api/compliance/cb?routeId=<uuid>` → validated JSON structure and Zod acceptance.

3. **Zod schema alignment**
   - When Zod returned `Unrecognized key(s)` errors, I opened the router file and matched the query/body keys exactly to what the frontend sent. I preferred keeping the backend’s strict validation and changing the frontend to match (fewer security risks).

4. **Unit and integration tests**
   - Wrote Vitest unit tests for core functions (computeEnergy, computeCB, computeComparison, bankSurplus, applyBanked, createPool) and Supertest integration tests for HTTP endpoints (`/routes`, `/routes/comparison`, `/compliance/cb`). Tests caught signature mismatches and missing exports.

5. **Fix imports / module export errors**
   - Cursor sometimes created files with the same name (`apiClient.ts`) for interface and implementation, causing circular imports or missing exports. I resolved these by renaming implementation to `apiClientAxios.ts` (or adding `export default`) and fixing imports in `App.tsx`.

6. **Seed / DB checks**
   - Ran `npx prisma migrate dev` and `npx prisma db seed` and verified the five seeded routes exist in the `routes` table and resulting `ship_compliance` rows were created as expected.

7. **Edge-case testing**
   - Added tests for negative CBs, over-applying banked amounts, and invalid pool creation (ensuring totalBefore ≥ 0 and allocation rules are obeyed).

---

## Observations

### Where agents saved time
- **Cursor** quickly scaffolded a complete hexagonal project structure and repetitive boilerplate (Prisma schema, repository classes, Express routing files, initial React pages). That saved hours on file and folder creation.
- **ChatGPT** accelerated iteration: fast, targeted fixes, diagnosing runtime TypeScript/Zod errors, and producing precise patches (updated function signatures, Zod schema fixes, API client updates, and test code).

### Where agents failed or hallucinated
- **File paths & imports:** Cursor sometimes assumed different folder names or created multiple files with the same base name (caused circular-imports and missing export errors). These required manual renames (e.g., `apiClient.ts` → `apiClient.types.ts` + `apiClientAxios.ts`) and import path fixes.
- **Parameter conventions:** Initially some generated code used `year` or `shipId` whereas the backend Zod schema expected `routeId` (UUID). This mismatch produced `Unrecognized key(s)` errors — I resolved by aligning contract (prefer changing frontend to backend contract unless backend intent differs).
- **Overly generic tests / signatures:** Generated unit tests sometimes invoked functions using the wrong signatures (e.g., passing numbers where objects were expected). I updated tests to match the actual domain signatures present in `calculations.ts`.

### How tools were combined effectively
- **Cursor** to create consistent base scaffolding from `tasks.md`.
- **ChatGPT** for stepwise debugging, signature alignment, Zod validation, and writing tests.
- Iterate: run → fail → inspect error → ask/modify → re-run. Cursor handled bulk generation, ChatGPT handled correctness and iteration.

---

## Best Practices Followed

- **Use `tasks.md` (Cursor) as single source of truth** for scaffolding. Keeping the file up-to-date made subsequent regenerations predictable.
- **Keep core logic framework-free** (pure functions in `core/application`), so tests can target domain logic without Express/Prisma.
- **Ports & adapters** (Hexagonal) — implemented `ApiClient` interface and separate Prisma repository classes to keep core decoupled from infrastructure.
- **Zod validation** on inbound adapters only — strict schemas and `.strict()` to avoid accidental extra keys.
- **TypeScript strict mode** and `tsconfig` settings that include Vitest types to keep type safety across tests and code.
- **Small, verifiable commits** — each change was tested locally with `npm run dev` and `npm run test` to produce a clear incremental commit history.
- **Tests for edge cases** (negative CBs, over-apply bank, invalid pools) — these prevented regressions in pooling and banking rules.
- **Manual verification** of seed data, Prisma migrations, and a few sample API requests to ensure the end-to-end plumbing worked.

---

## Short usage tips for evaluators

- Start backend: `cd backend && npm install && npm run dev`
- Seed DB (if necessary): `npx prisma migrate dev && npx prisma db seed`
- Start frontend: `cd frontend && npm install && npm run dev`
- Run tests (backend): `cd backend && npm run test`

---


