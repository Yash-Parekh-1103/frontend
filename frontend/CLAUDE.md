# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important Next.js Version Notice

⚠️ **This project uses Next.js 16.2.2 with breaking changes** - APIs, conventions, and file structure may differ from training data. Always read the relevant guide in `node_modules/next/dist/docs/` before writing any Next.js code. Heed deprecation notices.

## Development Commands

```bash
# Start development server
pnpm dev            # Preferred package manager
# Alternative: npm run dev, yarn dev, or bun dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

## Movie Platform Overview

A free streaming platform where users can upload movies via URL, watch content, create playlists, and discover content through AI-powered recommendations and semantic search.

### Tech Stack
- **Frontend**: Next.js 16.2.2 with App Router
- **Backend**: Express with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Vector DB**: Qdrant for AI features
- **Authentication**: Clerk
- **Styling**: Tailwind CSS v4
- **Package Manager**: pnpm

---

## 🗄️ Database Schema (Minimal & Clean)

### **Core Tables**
```sql
users
├── id (UUID, Primary Key)
├── username (string)
├── email (string, unique) -- Used for fetching user data
├── updated_at (timestamp)

movies
├── id (UUID, Primary Key)
├── title (string)
├── description (text)
├── genre (string)
├── release_year (integer)
├── cast (JSON array)
├── video_url (string)
├── poster_url (string)
├── duration (minutes)
├── uploaded_by (user_id FK)
├── average_rating (decimal)

watchlists (User Playlists)
├── id (UUID, Primary Key)
├── user_id (FK to users.id)
├── movie_id (FK to movies.id)
├── added_at (timestamp)

user_behavior (For AI Features)
├── id (UUID, Primary Key)
├── user_id (FK to users.id)
├── movie_id (FK to movies.id)
├── action_type (enum: watch, like, download, etc.)
├── watch_progress (seconds)
├── session_duration (seconds)
├── created_at (timestamp)

download_history
├── id (UUID, Primary Key)
├── user_id (FK to users.id)
├── movie_id (FK to movies.id)
├── download_url (string)
├── downloaded_at (timestamp)
```

---

## 🏗️ Feature-Based Architecture

### **Frontend Structure (Next.js 16)**
```
src/
├── app/                           # App Router
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page
│   ├── movies/
│   │   ├── page.tsx               # Movies listing
│   │   └── [id]/page.tsx          # Movie details
│   ├── search/
│   │   └── page.tsx               # Search page
│   ├── profile/
│   │   └── page.tsx               # User profile with playlist
│   └── upload/
│       └── page.tsx               # Movie upload
├── components/
│   ├── ui/                        # Shadcn/UI components
│   ├── VideoPlayer/               # Custom video player
│   ├── MovieCard/                 # Movie display
│   ├── SearchBox/                 # Search components
│   └── Navigation/                # Layout components
├── lib/
│   ├── api.ts                     # API client
│   ├── clerk.ts                   # Clerk config
│   └── utils.ts                   # Utilities
└── types/                         # TypeScript types
```

### **Backend Structure (Express + TypeScript)**
```
src/
├── features/
│   ├── auth/
│   │   ├── auth.router.ts         # Auth routes
│   │   └── auth.controller.ts     # Auth logic
│   ├── movies/
│   │   ├── movies.router.ts       # Movie CRUD routes
│   │   └── movies.controller.ts   # Movie business logic
│   ├── search/
│   │   ├── search.router.ts       # Search endpoints
│   │   └── search.controller.ts   # Search logic
│   ├── recommendations/
│   │   ├── recommendations.router.ts
│   │   └── recommendations.controller.ts
│   ├── playlists/
│   │   ├── playlists.router.ts    # User playlist routes
│   │   └── playlists.controller.ts # Playlist logic
│   ├── downloads/
│   │   ├── downloads.router.ts
│   │   └── downloads.controller.ts
│   └── users/
│       ├── users.router.ts        # User operations
│       └── users.controller.ts    # User logic
├── database/
│   ├── schema.ts                  # Drizzle schema
│   ├── migrations/                # DB migrations
│   └── connection.ts              # DB connection
├── middleware/
│   ├── auth.ts                    # Clerk auth middleware
│   ├── cors.ts                    # CORS setup
│   └── validation.ts              # Request validation
├── services/
│   ├── aiService.ts               # AI processing
│   ├── qdrantService.ts           # Vector DB operations
│   └── videoService.ts            # Video URL validation
└── utils/
    └── embeddingUtils.ts          # Text embedding generation
```

---

## 🤖 AI Implementation

### **Qdrant Vector Collections**
1. **movie_descriptions** - Text embeddings of movie metadata
2. **user_preferences** - User behavior and preference vectors

### **AI Features**
- **Text Embeddings**: Movie descriptions for semantic search
- **User Behavior Vectors**: Track viewing patterns, ratings, genre preferences
- **Recommendation Engine**: Content-based recommendations
- **Semantic Search**: Natural language query processing

---

## 🚀 Core Features

### **User Management**
- Clerk authentication integration
- User profiles accessible by email
- Personal playlist management (watchlists)
- Guest viewing allowed

### **Movie Management**
- Upload movies via URL
- Basic metadata: title, description, genre, release year, cast
- Movie poster/thumbnail support
- Average rating display

### **Platform Features**
- Free streaming with video player
- Personal watchlist/playlist functionality
- Download functionality for offline viewing
- Watch progress tracking
- AI-powered content recommendations
- Basic text search + semantic search

---

## 📋 Development Approach

### **Feature-Based Development**
1. Each feature is self-contained in its own folder
2. Router and Controller files handle all logic for that feature
3. Clean separation of concerns
4. Easy to maintain and scale

### **Key Principles**
- Minimal database schema with essential fields only
- Email-based user identification (no Clerk user ID storage)
- Simple playlist system via watchlists table
- On-demand AI processing
- Feature-based backend organization

### **API Endpoints Structure**
- `/api/auth/*` - Authentication
- `/api/movies/*` - Movie operations
- `/api/search/*` - Search functionality  
- `/api/recommendations/*` - AI recommendations
- `/api/playlists/*` - User playlists
- `/api/downloads/*` - Download management
- `/api/users/*` - User operations

---

## 🎯 Next Steps

1. Set up database schema with Drizzle
2. Implement feature-based backend structure
3. Create basic frontend pages
4. Integrate Clerk authentication
5. Build core movie and playlist functionality
6. Add AI features with Qdrant integration