# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A movie streaming platform monorepo with both frontend and backend applications. Users can upload movies via URL, watch content, create playlists, and discover content through AI-powered recommendations and semantic search.

**Architecture**: Monorepo with separate frontend (Next.js) and backend (Express) applications.

## Development Commands

### Root Level Commands
```bash
# Navigate to specific application
cd frontend    # Next.js 16.2.2 application
cd backend     # Express TypeScript API

# No root-level package.json - work in individual directories
```

### Frontend (Next.js 16.2.2)
```bash
cd frontend

# Development
pnpm dev            # Start dev server on :3000
pnpm build          # Build for production
pnpm start          # Start production server
pnpm lint           # Run ESLint

# ⚠️ IMPORTANT: Next.js 16.2.2 has breaking changes
# Always check node_modules/next/dist/docs/ before writing Next.js code
```

### Backend (Express + TypeScript)
```bash
cd backend

# Development  
pnpm dev            # Start dev server with nodemon on :3001
pnpm build          # Compile TypeScript to dist/
pnpm start          # Start production server from dist/

# Database Operations (Drizzle)
pnpm db:generate    # Generate migrations from schema
pnpm db:migrate     # Run pending migrations  
pnpm db:push        # Push schema directly to DB (dev only)
pnpm db:studio      # Open Drizzle Studio

# Health check
curl http://localhost:3001/health
```

## Technology Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | Next.js 16.2.2 (App Router), React 19.2.4, Tailwind CSS v4 |
| **Backend** | Express 5.2.1, TypeScript, Node.js |
| **Database** | PostgreSQL with Drizzle ORM |
| **Vector DB** | Qdrant (for AI features) |
| **Authentication** | Clerk |
| **Package Manager** | pnpm |
| **Validation** | Zod schemas |

## Monorepo Architecture

### Directory Structure
```
movie-platform/
├── frontend/              # Next.js 16.2.2 App Router application
│   ├── app/               # App Router pages
│   │   ├── layout.tsx     # Root layout with Clerk
│   │   └── page.tsx       # Home page
│   ├── CLAUDE.md          # Frontend-specific guidance
│   ├── PROJECT.md         # Detailed project documentation  
│   └── package.json       # Frontend dependencies
│
├── backend/               # Express TypeScript API
│   ├── src/
│   │   └── database/      # Drizzle ORM setup
│   │       ├── schema.ts  # Database schema with Zod validation
│   │       ├── connection.ts
│   │       └── index.ts
│   ├── server.ts          # Express server entry point
│   ├── drizzle.config.ts  # Drizzle configuration
│   └── package.json       # Backend dependencies
│
└── .claude/
    └── settings.json      # Claude permissions
```

## Database Schema (Email-Based User System)

**Key Design**: Users identified by email (from Clerk), no Clerk user IDs stored.

### Core Tables
- **movies**: Movie metadata with download URLs, uploaded by user email
- **watchlists**: User playlists linking user emails to movie IDs  
- **user_behavior**: AI tracking for recommendations (views, likes, downloads)

### Database Operations
```bash
# Schema is defined in backend/src/database/schema.ts
# Uses Drizzle ORM with comprehensive Zod validation schemas

cd backend
pnpm db:generate    # After schema changes
pnpm db:migrate     # Apply to database
pnpm db:studio      # Visual database browser
```

## Feature-Based Backend Architecture

The backend is designed for a feature-based architecture (not yet implemented):

```
backend/src/features/
├── movies/           # Movie CRUD operations
├── search/           # Text + semantic search  
├── recommendations/  # AI-powered suggestions
├── playlists/        # User watchlist management
├── downloads/        # Download tracking
└── users/           # User operations
```

Each feature contains:
- `*.router.ts` - Express routes
- `*.controller.ts` - Business logic

## AI Implementation Plan

### Vector Database (Qdrant)
- **movie_descriptions** collection: Text embeddings for semantic search
- **user_preferences** collection: User behavior vectors for recommendations

### AI Services (Not Yet Implemented)
- OpenAI API for text embeddings
- Semantic search on movie descriptions
- Content-based recommendations from user behavior

## Development Workflow

### Working with Both Applications

1. **Start Development Servers**:
   ```bash
   # Terminal 1: Backend
   cd backend && pnpm dev     # :3001
   
   # Terminal 2: Frontend  
   cd frontend && pnpm dev    # :3000
   ```

2. **Database Setup** (First time):
   ```bash
   cd backend
   # Configure DATABASE_URL in .env
   pnpm db:push              # Push initial schema
   ```

3. **Environment Setup**:
   - Backend: Copy `.env.example` → `.env`, configure PostgreSQL
   - Frontend: Copy `.env.example` → `.env.local`, configure Clerk keys

### Working with Individual Components

- **Frontend Only**: Focus on `frontend/` directory, uses existing CLAUDE.md
- **Backend Only**: Focus on `backend/` directory  
- **Database Changes**: Always work from `backend/` directory for schema modifications

## API Communication

- **Frontend Port**: 3000
- **Backend Port**: 3001  
- **Proxy Setup**: Frontend configured to proxy API calls to backend
- **Health Check**: `http://localhost:3001/health`

## Key Architectural Decisions

1. **Monorepo Structure**: Separate applications, not using workspaces
2. **Email-Based Users**: Clerk emails used as user identifiers (no user table)
3. **Feature-Based Backend**: Organized by business functionality  
4. **Zod Validation**: Comprehensive request/response validation
5. **AI-Ready**: Prepared for Qdrant integration and OpenAI embeddings

## Development Status

**Current State**: Foundation phase
- ✅ Basic project structure established
- ✅ Database schema defined with Drizzle
- ✅ Frontend with Clerk authentication
- ✅ Basic backend server with health endpoint

**Next Phase**: Core feature implementation
- Movie CRUD operations
- User playlist management  
- Basic search functionality
- Frontend pages and components

**Future**: AI features integration
- Qdrant vector database setup
- Semantic search implementation
- Recommendation engine

## Important Notes

- **Next.js 16.2.2**: Breaking changes from training data - always check documentation
- **Package Manager**: Use `pnpm` consistently across both applications
- **Type Safety**: Comprehensive TypeScript setup with Zod validation
- **Authentication**: Clerk handles auth, backend validates via middleware (to be implemented)
- **Database**: PostgreSQL with Drizzle ORM, migration-based schema management