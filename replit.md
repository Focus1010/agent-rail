# AgentRail MVP

## Overview

AgentRail is a transparent x402 payment rail for AI agents. This is a complete MVP prototype built as a React + Vite web application with a strict black/white dark theme.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifacts/agentrail)
- **API framework**: Express 5 (artifacts/api-server)
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: Wouter
- **State**: Custom localStorage-backed store

## Architecture

- **Landing page** (`/`): Hero, features, code snippet, auth forms
- **Dashboard** (`/dashboard`): Balance, agents, spend chart, transactions
- **Agents** (`/agents`): Agent management, spend limits, daily charts
- **Policies** (`/policies`): Monthly cap slider, per-agent limits, policy rules
- **Analytics** (`/analytics`): Trends, pie charts, endpoint rankings
- **Demo** (`/demo`): Interceptor test — simulates 402 payment flow
- **Docs** (`/docs`): Quick start, API reference, policy docs, architecture

## Theme

Strict black/white: #000 background, #111 cards, #1a1a1a borders, #222 accents. No colors except white/gray/black. Dark mode by default.

## State Management

All data is mock/simulated using a custom store in `src/lib/store.ts` backed by localStorage. No real backend needed for the prototype — wallet balances, agents, transactions are all client-side.

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/agentrail run dev` — run frontend locally
- `pnpm --filter @workspace/api-server run dev` — run API server locally
