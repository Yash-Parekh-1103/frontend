# Movie Platform Project

A free streaming platform where users can upload movies via URL, watch content, create playlists, and discover content through AI-powered recommendations and semantic search.

## 🎯 Project Overview

### Core Concept
- Users add movies by providing download links (no video hosting)
- Free movie discovery and download platform
- Personal playlists and watchlists
- AI-powered recommendations and semantic search
- Direct download functionality via user-provided links

### Target Users
- Movie enthusiasts looking for download links
- Users who want to organize and discover movies
- People seeking a clean movie download platform

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | Next.js 16.2.2 (App Router) |
| **Backend** | Express.js with TypeScript |
| **Database** | PostgreSQL with Drizzle ORM |
| **Vector DB** | Qdrant (for AI features) |
| **Authentication** | Clerk |
| **Styling** | Tailwind CSS v4 |
| **Package Manager** | pnpm |
| **Storage** | Self-hosted (MVP) |

---

## 🗂️ Project Structure

```
movie-platform/
├── frontend/                      # Next.js 16 App
│   ├── src/
│   │   ├── app/                   # App Router
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx           # Home page
│   │   │   ├── movies/
│   │   │   │   ├── page.tsx       # Movies listing
│   │   │   │   └── [id]/page.tsx  # Movie details
│   │   │   ├── search/page.tsx    # Search functionality
│   │   │   ├── profile/page.tsx   # User profile + playlists
│   │   │   └── upload/page.tsx    # Movie upload
│   │   ├── components/
│   │   │   ├── ui/                # Shadcn/UI components
│   │   │   ├── VideoPlayer/
│   │   │   ├── MovieCard/
│   │   │   ├── SearchBox/
│   │   │   └── Navigation/
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   ├── clerk.ts
│   │   │   └── utils.ts
│   │   └── types/
│   └── package.json
└── backend/                       # Express API
    ├── src/
    │   ├── features/              # Feature-based architecture
    │   │   ├── auth/
    │   │   │   ├── auth.router.ts
    │   │   │   └── auth.controller.ts
    │   │   ├── movies/
    │   │   │   ├── movies.router.ts
    │   │   │   └── movies.controller.ts
    │   │   ├── search/
    │   │   │   ├── search.router.ts
    │   │   │   └── search.controller.ts
    │   │   ├── recommendations/
    │   │   │   ├── recommendations.router.ts
    │   │   │   └── recommendations.controller.ts
    │   │   ├── playlists/
    │   │   │   ├── playlists.router.ts
    │   │   │   └── playlists.controller.ts
    │   │   ├── downloads/
    │   │   │   ├── downloads.router.ts
    │   │   │   └── downloads.controller.ts
    │   │   └── users/
    │   │       ├── users.router.ts
    │   │       └── users.controller.ts
    │   ├── database/
    │   │   ├── schema.ts          # Drizzle schema
    │   │   ├── migrations/
    │   │   └── connection.ts
    │   ├── middleware/
    │   │   ├── auth.ts
    │   │   ├── cors.ts
    │   │   └── validation.ts
    │   ├── services/
    │   │   ├── aiService.ts
    │   │   ├── qdrantService.ts
    │   │   └── videoService.ts
    │   ├── utils/
    │   │   └── embeddingUtils.ts
    │   └── app.ts
    └── package.json
```

---

## 🗄️ Database Design

### Core Tables (Minimal Schema)

```sql
-- Users table (email-based identification)
users {
  id: UUID (Primary Key)
  username: string
  email: string (unique, indexed)
  updated_at: timestamp
}

-- Movies table (simplified)
movies {
  id: UUID (Primary Key)
  title: string
  description: text
  genre: string
  release_year: integer
  cast: JSON[]
  download_url: string          -- User-provided download link
  poster_url: string
  duration: integer (minutes)
  uploaded_by: UUID (FK -> users.id)
  average_rating: decimal
}

-- User playlists (watchlists)
watchlists {
  id: UUID (Primary Key)
  user_id: UUID (FK -> users.id)
  movie_id: UUID (FK -> movies.id)
  added_at: timestamp
}

-- User behavior for AI (recommendations)
user_behavior {
  id: UUID (Primary Key)
  user_id: UUID (FK -> users.id)
  movie_id: UUID (FK -> movies.id)
  action_type: enum (view, like, download, add_to_playlist)
  created_at: timestamp
}

-- Download history
download_history {
  id: UUID (Primary Key)
  user_id: UUID (FK -> users.id)
  movie_id: UUID (FK -> movies.id)
  download_url: string
  downloaded_at: timestamp
}
```

### Key Design Decisions
- **No reviews table**: Keeping it minimal
- **Email-based user lookup**: No Clerk user ID stored
- **Simplified movies table**: Removed unnecessary fields
- **Watchlists = Playlists**: Single table for user movie collections

---

## 🚀 API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/webhook` - Clerk webhook for user creation
- `GET /api/auth/user` - Get current user info

### Movies (`/api/movies`)
- `GET /api/movies` - List all movies (with pagination)
- `GET /api/movies/:id` - Get single movie details
- `POST /api/movies` - Add new movie with download link
- `PUT /api/movies/:id` - Update movie details
- `DELETE /api/movies/:id` - Delete movie

### Search (`/api/search`)
- `GET /api/search?q=query` - Basic text search
- `POST /api/search/semantic` - AI-powered semantic search
- `GET /api/search/filters` - Advanced filtering options

### Recommendations (`/api/recommendations`)
- `GET /api/recommendations/user/:email` - Personalized recommendations
- `GET /api/recommendations/similar/:movieId` - Similar movies
- `POST /api/recommendations/feedback` - Track user interactions

### Playlists (`/api/playlists`)
- `GET /api/playlists/user/:email` - Get user's playlist
- `POST /api/playlists` - Add movie to playlist
- `DELETE /api/playlists/:id` - Remove from playlist

### Downloads (`/api/downloads`)
- `GET /api/downloads/:movieId` - Get download link for movie
- `GET /api/downloads/history/:email` - Download history
- `POST /api/downloads/track` - Track download activity

### Users (`/api/users`)
- `GET /api/users/:email` - Get user profile
- `PUT /api/users/:email` - Update user profile

---

## 🤖 AI Features Implementation

### Qdrant Collections
```javascript
// Collection 1: Movie descriptions
movie_descriptions {
  vector_size: 1536,  // OpenAI embedding size
  distance: "Cosine"
}

// Collection 2: User preferences
user_preferences {
  vector_size: 512,   // Custom user behavior vectors
  distance: "Cosine"
}
```

### AI Workflows
1. **Text Embeddings**: Generate embeddings for movie descriptions using OpenAI API
2. **User Behavior Tracking**: Record views, likes, downloads for preference learning
3. **Semantic Search**: Convert user queries to vectors, search against movie embeddings
4. **Recommendations**: Combine content-based and collaborative filtering

---

## 🎨 Frontend Pages & Components

### Pages
- **Home** (`/`) - Featured movies, trending content
- **Movies** (`/movies`) - All movies with search/filter
- **Movie Details** (`/movies/[id]`) - Movie details, download link, add to playlist
- **Search** (`/search`) - Search interface with semantic capabilities
- **Profile** (`/profile`) - User playlists, download history
- **Add Movie** (`/add-movie`) - Form to add movie with download link

### Key Components
- **MovieCard** - Movie thumbnail, title, rating, download button
- **SearchBox** - Text input with autocomplete and semantic search
- **PlaylistManager** - Add/remove movies from playlists
- **DownloadButton** - Secure download link access
- **Navigation** - Header with auth status, search, profile links

---

## 📋 Development Phases

### Phase 1: Foundation (2-3 weeks)
- [ ] Set up Next.js 16 frontend with Tailwind
- [ ] Create Express backend with TypeScript
- [ ] Set up PostgreSQL database with Drizzle
- [ ] Implement Clerk authentication
- [ ] Basic project structure and routing

### Phase 2: Core Features (3-4 weeks)
- [ ] Movie addition via download link functionality
- [ ] Movie details pages with download access
- [ ] User playlist (watchlist) management
- [ ] Simple text search
- [ ] User profiles accessible by email

### Phase 3: Enhanced Features (2-3 weeks)
- [ ] Download link validation and security
- [ ] User activity tracking (views, downloads)
- [ ] Basic movie recommendation system
- [ ] Improved UI/UX and responsive design

### Phase 4: AI Integration (3-4 weeks)
- [ ] Set up Qdrant vector database
- [ ] Implement text embedding generation
- [ ] Semantic search functionality
- [ ] AI-powered recommendations
- [ ] User behavior analytics

### Phase 5: Polish & Optimization (2-3 weeks)
- [ ] Performance optimization
- [ ] Advanced search filters
- [ ] Mobile responsiveness
- [ ] Error handling and validation
- [ ] Deployment preparation

---

## 🔧 Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- pnpm package manager
- Qdrant instance (local or cloud)

### Environment Variables
```bash
# Frontend (.env.local)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_API_URL=http://localhost:3001

# Backend (.env)
DATABASE_URL=postgresql://user:password@localhost:5432/moviedb
CLERK_SECRET_KEY=
QDRANT_URL=http://localhost:6333
OPENAI_API_KEY=
PORT=3001
```

### Installation & Running
```bash
# Install dependencies
pnpm install

# Start PostgreSQL and Qdrant
# Run database migrations
pnpm db:migrate

# Start development servers
pnpm dev:frontend   # Next.js on :3000
pnpm dev:backend    # Express on :3001
```

---

## 🎯 Success Metrics

### User Engagement
- Movies viewed per user
- Playlist creation rate
- Download activity rate
- Return visit frequency

### Platform Growth
- New movie additions per week
- User registration growth
- Search query success rate
- Download link quality/availability

### AI Effectiveness
- Recommendation click-through rate
- Semantic search vs basic search usage
- User rating accuracy for recommendations

---

## 🚦 Future Enhancements

### Short-term
- Mobile app development
- Download link verification system
- Social features (user following, shared playlists)
- Content categorization and curation

### Long-term
- Link validation and quality scoring system
- Multi-language support
- Advanced analytics dashboard
- Monetization options (premium features)
- Content moderation and reporting system

---

## 📝 Notes

- **Legal Considerations**: Copyright and link sharing policies to be defined
- **Link Storage**: User-provided download links stored securely
- **Scalability**: Feature-based architecture supports microservices transition
- **Security**: Link validation and user authentication via Clerk
- **Performance**: Database indexing and caching strategies to be implemented

---

*Last updated: April 2026*