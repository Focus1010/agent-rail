# AgentRail

Transparent x402 payment rail for AI agents. A complete MVP prototype built with React + Vite.

## Overview

AgentRail is a payment infrastructure that allows AI agents to make autonomous payments without exposing private keys. It provides:

- **Managed Wallets** - Server-side wallets with USDC balance management
- **Policy Engine** - Monthly caps, per-agent spend limits, and endpoint controls
- **Transparent Interceptor** - Drop-in fetch replacement that handles 402 responses automatically

## Tech Stack

- **Frontend**: React 19 + TypeScript 5.9 + Vite 7
- **Styling**: Tailwind CSS v4 (strict black/white dark theme)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: Wouter
- **State**: Custom localStorage-backed store
- **API**: Express 5 (optional, frontend works standalone)

## Project Structure

```
agent-rail/
├── artifacts/
│   ├── agentrail/          # Main React frontend
│   └── api-server/         # Express API server (optional)
├── lib/
│   ├── api-client-react/   # React Query client utilities
│   ├── api-spec/          # OpenAPI spec + Orval config
│   ├── api-zod/           # Zod validation schemas
│   └── db/                # Drizzle ORM schema
├── scripts/               # Build scripts
├── package.json           # Root workspace config
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20+ (recommended: 22 or 24)
- npm 10+

### Installation

```bash
# Install all dependencies across workspaces
npm install
```

### Running Locally

```bash
# Start the frontend development server
npm run dev

# Or with explicit workspace
npm run dev --workspace=artifacts/agentrail
```

The app will be available at `http://localhost:8080`

### Building for Production

```bash
# Build the frontend
npm run build

# Output will be in artifacts/agentrail/dist/
```

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set the root directory to `artifacts/agentrail`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Install command: `cd ../.. && npm install`

Or use the CLI:

```bash
cd artifacts/agentrail
vercel --prod
```

### Static Hosting

The frontend is a static SPA. After building:

```bash
cd artifacts/agentrail/dist
# Serve with any static file server
npx serve .
```

## Features

### Pages

- **Landing** (`/`): Hero section, features, auth forms
- **Dashboard** (`/dashboard`): Balance, agents, spend charts, transactions
- **Agents** (`/agents`): Agent management with per-agent spend limits
- **Policies** (`/policies`): Monthly cap slider, policy rules
- **Analytics** (`/analytics`): Trends, pie charts, endpoint rankings
- **Demo** (`/demo`): Interactive interceptor test showing x402 payment flow
- **Docs** (`/docs`): Quick start, API reference, architecture docs

### Mock Data

The app uses simulated data stored in localStorage:

- **Wallet**: $250 USDC balance, $500 monthly cap
- **Agents**: ResearchSwarm, DataFetcher, CodeAnalyzer
- **Transactions**: 8 pre-populated payment records

### Authentication

Mock auth - just enter any email/name to access the dashboard. No real backend required.

## Theme

Strict black/white dark theme:

- Background: `#000000`
- Cards: `#111111`
- Borders: `#1a1a1a`
- Accents: `#222222`
- Text: `#ffffff` (primary), `#888888` (secondary)

## Development

### Available Scripts

```bash
# Root level
npm run dev              # Start frontend dev server
npm run dev:api          # Start API server (optional)
npm run build            # Build frontend
npm run typecheck        # Type-check all packages

# Frontend (artifacts/agentrail)
npm run dev              # Vite dev server
npm run build            # Production build
npm run typecheck        # TypeScript check

# API Server (artifacts/api-server)
npm run dev              # Build and start
npm run build            # Build only
npm run start            # Start built server
```

### Workspace Commands

```bash
# Install in specific workspace
npm install <package> --workspace=artifacts/agentrail

# Run script in specific workspace
npm run build --workspace=lib/db
```

## API Server (Optional)

The Express API server is optional. The frontend works entirely with localStorage mock data.

To run the API server:

```bash
cd artifacts/api-server
npm run dev
```

Environment variables:
- `PORT` - Server port (default: 3000)

## Architecture

```
Your Agent            AgentRail               API Provider
----------           -----------             -------------
    |                     |                       |
    |--- fetch(url) ---->|                       |
    |                     |--- GET url ---------->|
    |                     |<-- 402 Payment -------|
    |                     |                       |
    |                     |-- Check Policy --|    |
    |                     |<- Approved ------|    |
    |                     |                       |
    |                     |-- Sign Payment --|    |
    |                     |<- x402 Header ---|    |
    |                     |                       |
    |                     |--- GET url + x402 --->|
    |                     |<-- 200 OK ------------|
    |<-- response --------|                       |
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

MIT

---

Built as MVP test — $49/mo planned pricing
