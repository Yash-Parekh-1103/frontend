# Frontend-Backend API Integration

This document describes the complete integration between the Next.js frontend and Express.js backend for the Movie Platform.

## Overview

The integration includes:
- **API Client**: Axios-based HTTP client with interceptors
- **Custom Hooks**: React hooks for movie CRUD operations
- **Form Components**: React Hook Form-based movie upload/edit forms  
- **UI Components**: Movie cards, lists, and search functionality
- **Type Safety**: Complete TypeScript integration

## Architecture

### API Layer
```
frontend/lib/api.ts          # Axios client configuration
frontend/types/movie.ts      # TypeScript type definitions
frontend/hook/useMovies.tsx  # Custom API hooks
```

### Components Layer
```
frontend/components/movies/
├── MovieForm.tsx       # Movie upload/edit form (React Hook Form)
├── MovieCard.tsx       # Individual movie display
├── MovieList.tsx       # Movie grid with CRUD actions
└── MovieSearch.tsx     # Search with autocomplete dropdown
```

### Pages Layer
```
frontend/app/
├── page.tsx           # Landing page with feature overview
└── movies/page.tsx    # Main movies interface
```

## API Configuration

### Environment Variables
```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Axios Client Features
- **Base URL**: Configurable via environment variable
- **Timeout**: 10 second request timeout
- **Interceptors**: Request/response logging in development
- **Error Handling**: Automatic error logging and status code handling

## Custom Hooks

### useMovies()
Fetches all movies from the API.
```typescript
const { movies, loading, error, refetch } = useMovies();
```

### useMovie(id)
Fetches a single movie by ID.
```typescript
const { movie, loading, error, refetch } = useMovie('movie-id');
```

### useCreateMovie()
Creates a new movie with validation.
```typescript
const { createMovie, loading, error } = useCreateMovie();
const newMovie = await createMovie(movieData);
```

### useUpdateMovie()
Updates an existing movie.
```typescript
const { updateMovie, loading, error } = useUpdateMovie();
const updatedMovie = await updateMovie(id, updateData);
```

### useDeleteMovie()
Deletes a movie.
```typescript
const { deleteMovie, loading, error } = useDeleteMovie();
const success = await deleteMovie(id);
```

### useMoviesByUser(email)
Fetches movies uploaded by a specific user.
```typescript
const { movies, loading, error, refetch } = useMoviesByUser(userEmail);
```

### useMovieSearch()
Performs movie search with debouncing.
```typescript
const { results, loading, error, searchMovies, clearSearch } = useMovieSearch();
await searchMovies('search query');
```

## User Authentication Integration

### useCurrentUser Hook
The frontend uses a custom hook that wraps Clerk's authentication:

```typescript
// frontend/hook/useUser.tsx
export const useCurrentUser = () => {
  // Returns: { username, fullName, imageUrl, email, isLoaded }
}
```

### API Integration
- User email is automatically attached to movie uploads
- User-specific movie filtering based on email
- Authentication state handling in components

## Form Validation

### React Hook Form Integration
Movie forms use React Hook Form with comprehensive validation:

```typescript
// Form validation rules
title: { required: 'Title is required', minLength: 1 }
downloadUrl: { 
  required: 'Download URL is required',
  pattern: { value: /^https?:\/\/.+/, message: 'Must be a valid URL' }
}
releaseYear: { 
  min: { value: 1900, message: 'Year must be 1900 or later' },
  max: { value: 2030, message: 'Year must be 2030 or earlier' }
}
```

### Server-Side Validation
API validation errors are automatically mapped to form fields:
```typescript
// Server validation errors are displayed on respective form fields
if (error.response?.data?.errors) {
  validationErrors.forEach((error) => {
    setError(error.path[0], { message: error.message });
  });
}
```

## Component Features

### MovieForm Component
- **Responsive Design**: Mobile-first layout
- **Real-time Validation**: Client-side validation with server error mapping
- **File Upload**: URL-based movie and poster uploads
- **Auto-save**: Form state preservation
- **Loading States**: Submit button loading indicators

### MovieCard Component
- **Responsive Grid**: Automatically adjusts to screen size
- **Image Handling**: Graceful fallback for missing posters
- **Action Buttons**: Context-aware edit/delete buttons for owners
- **Rating Display**: Visual star rating with formatted scores
- **Hover Effects**: Smooth animations and transitions

### MovieList Component  
- **Pagination Ready**: Structured for future pagination
- **Filtering**: User-specific movie filtering
- **Bulk Actions**: Delete confirmation modals
- **Empty States**: Helpful messages for empty lists
- **Real-time Updates**: Automatic refresh after CRUD operations

### MovieSearch Component
- **Autocomplete**: Dropdown with search results
- **Debouncing**: 300ms search delay to reduce API calls
- **Keyboard Navigation**: Escape to close, enter to select
- **Loading States**: Search progress indicators
- **Result Limiting**: Shows top 5 results in dropdown

## Error Handling

### API Error Handling
```typescript
// Automatic error handling in API client
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
    } else if (error.response?.status === 404) {
      // Handle not found
    } else if (error.response?.status === 500) {
      // Handle server errors
    }
    return Promise.reject(error);
  }
);
```

### Component Error States
- Loading spinners during API calls
- Error messages with retry buttons
- Form validation error display
- Network error handling

## Performance Optimizations

### API Optimizations
- **Request Debouncing**: Search queries debounced to 300ms
- **Automatic Retries**: Failed requests can be manually retried
- **Response Caching**: Browser-level caching for static content
- **Lazy Loading**: Components loaded on demand

### React Optimizations
- **Conditional Rendering**: Components only render when needed
- **Event Handler Optimization**: Proper cleanup in useEffect hooks
- **State Management**: Local state for UI, API state for data
- **Image Optimization**: Next.js Image component for posters

## API Endpoint Coverage

### Implemented Endpoints
✅ `GET /api/movies` - List all movies  
✅ `POST /api/movies` - Create movie  
✅ `GET /api/movies/:id` - Get movie by ID  
✅ `PUT /api/movies/:id` - Update movie  
✅ `DELETE /api/movies/:id` - Delete movie  
✅ `GET /api/movies/user/:email` - Get movies by user  
✅ `GET /api/movies/search/:query` - Search movies  

### Request/Response Format
All API responses follow a consistent format:
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ValidationError[];
  count?: number;
  query?: string;
}
```

## Development Workflow

### Running Both Services
```bash
# Terminal 1: Backend (runs on :3001)
cd backend && pnpm dev

# Terminal 2: Frontend (runs on :3000)
cd frontend && pnpm dev
```

### Testing the Integration
1. **API Health**: `curl http://localhost:3001/health`
2. **Frontend**: Visit `http://localhost:3000`
3. **Movies Page**: Visit `http://localhost:3000/movies`
4. **Upload Test**: Use the upload form to create a movie
5. **Search Test**: Use the search functionality

### Common Development Tasks
```bash
# Add new dependencies
cd frontend && pnpm add package-name

# Type checking
cd frontend && npx tsc --noEmit

# Build for production
cd frontend && pnpm build
```

## Security Considerations

### Data Validation
- Client-side validation for UX
- Server-side validation for security
- SQL injection prevention via Drizzle ORM
- XSS prevention via React's built-in escaping

### Authentication
- Clerk handles authentication tokens
- User email used for authorization
- No sensitive data in localStorage
- CORS configured for localhost development

### API Security
- Input sanitization on all endpoints
- Rate limiting ready for implementation
- Error messages don't leak system info
- File upload validation (URL format)

## Future Enhancements

### Planned Features
- **Image Upload**: Direct image upload for posters
- **Video Streaming**: In-browser video player
- **Real-time Updates**: WebSocket integration for live updates
- **Offline Support**: Service worker for offline functionality
- **Advanced Search**: Full-text search with filters
- **User Profiles**: Extended user management

### Performance Improvements
- **Pagination**: API pagination for large datasets
- **Infinite Scroll**: Client-side infinite scrolling
- **Image Optimization**: CDN integration for posters
- **API Caching**: Redis caching layer
- **Bundle Optimization**: Code splitting and lazy loading

## Troubleshooting

### Common Issues

**CORS Errors**:
```bash
# Backend needs manual CORS setup since cors package not installed
# Current solution: Manual CORS headers in server.ts
```

**Type Errors**:
```bash
# Frontend types must match backend schema
# Check: frontend/types/movie.ts vs backend/src/database/schema.ts
```

**API Connection**:
```bash
# Check environment variable
echo $NEXT_PUBLIC_API_URL

# Verify backend is running
curl http://localhost:3001/health

# Check network tab in browser dev tools
```

**Build Errors**:
```bash
# Check TypeScript compilation
cd frontend && npx tsc --noEmit

# Clear Next.js cache
cd frontend && rm -rf .next
```

This integration provides a solid foundation for the movie platform with full CRUD operations, search functionality, and user authentication integration.