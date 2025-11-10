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
<img width="466" height="728" alt="$RN53U1Y" src="https://github.com/user-attachments/assets/3c92ac41-f8c8-40c1-9125-4e624ef52d5f" />


- Backend server running (npm run dev)
<img width="1789" height="596" alt="$RAALPN7" src="https://github.com/user-attachments/assets/763402ef-aabc-4813-89ee-5bcd0f83e9d7" />


- Frontend running (Vite dev server)
<img width="1801" height="593" alt="$RZF6QTG" src="https://github.com/user-attachments/assets/68cfe492-e3b5-4e94-9993-4da4f510a4d8" />



- Successful test execution (npm run test)
<img width="1764" height="862" alt="$R8A11UJ" src="https://github.com/user-attachments/assets/abd7d104-85d3-4229-b483-f463195fbfad" />


- API responses in browser or Postman:
  - GET /api/routes
 <img width="2474" height="1468" alt="$RJTBD45" src="https://github.com/user-attachments/assets/bb5be028-afe3-402c-a4d3-64f45982e0a3" />


  - GET /api/routes/comparison
  <img width="1025" height="1136" alt="$R412UOU" src="https://github.com/user-attachments/assets/a3a8346c-69ba-45b2-8c69-a5a9c99e0d12" />

- Frontend UI pages:
  - Routes tab
    <img width="2551" height="1457" alt="image" src="https://github.com/user-attachments/assets/00d94d1f-8fc4-4d38-b288-eb3142fb47b2" />

  - Comparison tab
    <img width="2559" height="1462" alt="image" src="https://github.com/user-attachments/assets/ba50a145-9a71-4d12-a2f2-8ffe85cf549e" />

  - Banking tab
    ![Uploading image.png…]()

  - Pooling tab
    ![Uploading image.png…]()


These screenshots demonstrate full-stack functionality and help evaluators quickly verify the system’s features.


