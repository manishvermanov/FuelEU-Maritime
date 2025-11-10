# FuelEU Maritime Frontend

React + TypeScript + Vite frontend for FuelEU Maritime Compliance application.

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **TailwindCSS** for styling
- **shadcn/ui** components (Radix UI primitives)
- **Recharts** for data visualization
- **React Query** for data fetching
- **Axios** for HTTP requests
- **Vitest** + React Testing Library for testing

## Architecture

Follows **Hexagonal Architecture**:

- `core/domain/` - Domain models
- `core/application/` - Application services
- `core/ports/` - Interfaces/ports
- `adapters/ui/` - React components and hooks
- `adapters/infrastructure/api/` - Axios API client
- `shared/` - Shared utilities and UI components

## Setup

```bash
cd frontend
npm install
npm run dev
```

The app will run on `http://localhost:5173` (default Vite port).

## Backend Connection

The frontend connects to the backend API at:
- Base URL: `http://localhost:3000/api`

Make sure the backend server is running before using the frontend.

## Features

### Routes Tab
- View all routes with filters (vesselType, fuelType, year)
- Set baseline route
- Table view with route details

### Compare Tab
- Compare baseline vs candidate routes
- Show percentage difference and compliance status
- Bar chart visualization using Recharts

### Banking Tab
- View compliance balance (CB) data
- Bank surplus CB
- Apply banked CB to deficits
- Disable actions when CB ≤ 0

### Pooling Tab
- View adjusted CB for all routes
- Select routes to create a pool
- Validation:
  - Sum of adjusted CB must be ≥ 0
  - Deficit ships cannot exit worse
  - Surplus ships cannot go negative
- Create pool with validation

## Build

```bash
npm run build
```

## Test

```bash
npm run test
```

