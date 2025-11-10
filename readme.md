FuelEU Maritime — Full-Stack Compliance System
==================================================
A complete full-stack implementation of the FuelEU Maritime regulation system using Hexagonal Architecture, Node.js, TypeScript, PostgreSQL, Prisma, Express, React, and Tailwind CSS.

1. Overview
-----------
FuelEU Maritime is a regulatory framework aimed at reducing the greenhouse gas intensity of energy used by ships.
This project implements a simulation and management platform where shipping companies can:

- Manage vessel routes and mark a baseline route
- Compute carbon intensity, energy consumption, and compliance values
- Compare routes against a baseline
- Perform surplus credit banking and application
- Create cross-route pools under EU compliance rules

The system follows Hexagonal Architecture (Ports & Adapters).

2. Architecture Summary
------------------------

Backend
--------
Tech Stack:
- Node.js
- TypeScript
- Express
- PostgreSQL
- Prisma ORM
- Vitest + Supertest

Architecture:
backend/
  src/
    core/
      domain/
      application/
      ports/
    adapters/
      inbound/http/
      outbound/postgres/
    infrastructure/
      db/
      server/
    shared/
  prisma/
  tests/

Frontend
---------
Tech Stack:
- React
- TypeScript
- Tailwind CSS
- React Query

Architecture:
frontend/
  src/
    core/
      domain/
      application/
      ports/
    adapters/
      infrastructure/
      ui/
    shared/

3. Setup and Run Instructions
-----------------------------

Backend Setup:
1. Install dependencies:
   cd backend
   npm install

2. Configure database (.env):
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/fueleu"

3. Generate Prisma client:
   npx prisma generate

4. Run migrations:
   npx prisma migrate dev

5. Seed database:
   npx prisma db seed

6. Start backend:
   npm run dev

Frontend Setup:
1. Install dependencies:
   cd frontend
   npm install

2. Start frontend:
   npm run dev

4. How to Execute Tests
------------------------

Unit Tests:
- computeEnergy
- computeCB
- computeComparison
- bankSurplus
- applyBanked
- createPool

Run:
   cd backend
   npm run test

Integration Tests:
- GET /routes
- POST /routes/:id/baseline
- GET /routes/comparison
- /compliance endpoints
- /banking endpoints
- /pools

Run:
   npm run test

Data Tests:
- Migrations
- Seed data
- Schema integrity

5. Sample API Requests
-----------------------

GET /api/routes  
POST /api/routes/{routeId}/baseline  
GET /api/routes/comparison  
GET /api/compliance/cb?routeId={id}  
POST /api/banking/apply  

Pool example:
POST /api/pools
{
  "name": "Atlantic Pool",
  "members": [
    { "routeId": "...", "cbBefore": 1200 },
    { "routeId": "...", "cbBefore": -900 }
  ]
}

6. Screenshots or Sample Requests/Responses
-------------------------------------------
Include screenshots demonstrating:

- Project folder structure (backend + frontend)
![alt text](image.png)

- Backend server running (npm run dev)
![alt text](image-1.png)

- Frontend running (Vite dev server)
![alt text](image-2.png)


- Successful test execution (npm run test)
![alt text](image-3.png)

- API responses in browser or Postman:
  - GET /api/routes
  ![alt text](image-4.png)

  - GET /api/routes/comparison
  ![alt text](image-5.png)

  - POST /api/banking/apply
  - POST /api/pools
- Frontend UI pages:
  - Routes tab
  - Comparison tab
  - Banking tab
  - Pooling tab

These screenshots demonstrate full-stack functionality and help evaluators quickly verify the system’s features.


