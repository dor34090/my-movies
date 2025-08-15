import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import type { Movie } from '../helpers/interfaces'
import { moviesApi, type MovieApiRequest, type EditMovieApiRequest } from '../api/moviesApi'

// Define the initial state interface
export interface MoviesState {
  movies: Movie[]
  selectedMovie: Movie | null
  loading: boolean
  error: string | null
  searchQuery: string
  showFavoritesOnly: boolean
  favoriteMovieIds: number[]
  currentUsername: string
  favorites: Movie[]
}

// Initial state
const initialState: MoviesState = {
  movies: [],
  selectedMovie: null,
  loading: false,
  error: null,
  searchQuery: '',
  showFavoritesOnly: false,
  favoriteMovieIds: [],
  currentUsername: '',
  favorites: [],
}

// Async thunk for fetching movies
export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async () => {
    return await moviesApi.getAllMovies();
  }
)

// Async thunk for fetching a single movie
export const fetchMovieById = createAsyncThunk(
  'movies/fetchMovieById',
  async (id: number) => {
    return await moviesApi.getMovieById(id);
  }
)

// Async thunk for adding a movie
export const addMovieAsync = createAsyncThunk(
  'movies/addMovie',
  async (movieData: MovieApiRequest) => {
    return await moviesApi.addMovie(movieData);
  }
)

// Async thunk for editing a movie
export const editMovieAsync = createAsyncThunk(
  'movies/editMovie',
  async ({ id, movieData }: { id: number; movieData: EditMovieApiRequest }) => {
    return await moviesApi.editMovie(id, movieData);
  }
)

// Async thunk for deleting a movie
export const deleteMovieAsync = createAsyncThunk(
  'movies/deleteMovie',
  async ({ id, username }: { id: number; username: string }) => {
    await moviesApi.deleteMovie(id, username);
    return id;
  }
)

// Async thunk for fetching user's favorites
export const fetchFavorites = createAsyncThunk(
  'movies/fetchFavorites',
  async (username: string) => {
    return await moviesApi.getAllFavourites(username);
  }
)

// Async thunk for searching favorites
export const searchFavoritesAsync = createAsyncThunk(
  'movies/searchFavorites',
  async ({ username, searchTerm }: { username: string; searchTerm: string }) => {
    return await moviesApi.searchFavourites(username, searchTerm);
  }
)

// Async thunk for adding to favorites
export const addToFavoritesAsync = createAsyncThunk(
  'movies/addToFavorites',
  async ({ movieId, username }: { movieId: number; username: string }) => {
    await moviesApi.addToFavourites(movieId, username);
    return movieId;
  }
)

// Async thunk for removing from favorites
export const removeFromFavoritesAsync = createAsyncThunk(
  'movies/removeFromFavorites',
  async ({ movieId, username }: { movieId: number; username: string }) => {
    await moviesApi.removeFromFavourites(movieId, username);
    return movieId;
  }
)

// Async thunk for searching movies
export const searchMoviesAsync = createAsyncThunk(
  'movies/searchMovies',
  async (searchTerm: string) => {
    return await moviesApi.searchMovies(searchTerm);
  }
)

// Create the slice
const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    // Synchronous actions
    setSelectedMovie: (state, action: PayloadAction<Movie | null>) => {
      state.selectedMovie = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    setCurrentUsername: (state, action: PayloadAction<string>) => {
      state.currentUsername = action.payload
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    toggleShowFavoritesOnly: (state) => {
      state.showFavoritesOnly = !state.showFavoritesOnly
    },
    toggleFavoriteMovie: (state, action: PayloadAction<number>) => {
      const movieId = action.payload
      const index = state.favoriteMovieIds.indexOf(movieId)
      if (index === -1) {
        state.favoriteMovieIds.push(movieId)
      } else {
        state.favoriteMovieIds.splice(index, 1)
      }
    },
  },
  extraReducers: (builder) => {
    // Handle fetchMovies
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.movies = action.payload
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch movies'
      })
    
    // Handle fetchMovieById
    builder
      .addCase(fetchMovieById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMovieById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedMovie = action.payload
      })
      .addCase(fetchMovieById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch movie'
      })
    
    // Handle addMovieAsync
    builder
      .addCase(addMovieAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addMovieAsync.fulfilled, (state, action) => {
        state.loading = false
        state.movies.push(action.payload)
      })
      .addCase(addMovieAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to add movie'
      })
    
    // Handle editMovieAsync
    builder
      .addCase(editMovieAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(editMovieAsync.fulfilled, (state, action) => {
        state.loading = false
        const index = state.movies.findIndex(movie => movie.id === action.payload.id)
        if (index !== -1) {
          state.movies[index] = action.payload
        }
      })
      .addCase(editMovieAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to edit movie'
      })
    
    // Handle deleteMovieAsync
    builder
      .addCase(deleteMovieAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteMovieAsync.fulfilled, (state, action) => {
        state.loading = false
        state.movies = state.movies.filter(movie => movie.id !== action.payload)
        // Also remove from favorites if present
        const favIndex = state.favoriteMovieIds.indexOf(action.payload)
        if (favIndex !== -1) {
          state.favoriteMovieIds.splice(favIndex, 1)
        }
      })
      .addCase(deleteMovieAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to delete movie'
      })
    
    // Handle fetchFavorites
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false
        state.favorites = action.payload
        state.favoriteMovieIds = action.payload.map(movie => movie.id)
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch favorites'
      })
    
    // Handle addToFavoritesAsync
    builder
      .addCase(addToFavoritesAsync.fulfilled, (state, action) => {
        const movieId = action.payload
        if (!state.favoriteMovieIds.includes(movieId)) {
          state.favoriteMovieIds.push(movieId)
        }
      })
      .addCase(addToFavoritesAsync.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to add to favorites'
      })
    
    // Handle removeFromFavoritesAsync
    builder
      .addCase(removeFromFavoritesAsync.fulfilled, (state, action) => {
        const movieId = action.payload
        const index = state.favoriteMovieIds.indexOf(movieId)
        if (index !== -1) {
          state.favoriteMovieIds.splice(index, 1)
        }
        state.favorites = state.favorites.filter(movie => movie.id !== movieId)
      })
      .addCase(removeFromFavoritesAsync.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to remove from favorites'
      })
    
    // Handle searchMoviesAsync
    builder
      .addCase(searchMoviesAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchMoviesAsync.fulfilled, (state, action) => {
        state.loading = false
        state.movies = action.payload
      })
      .addCase(searchMoviesAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to search movies'
      })
  },
})

// Export actions
export const { 
  setSelectedMovie, 
  clearError, 
  setCurrentUsername,
  setSearchQuery,
  toggleShowFavoritesOnly,
  toggleFavoriteMovie
} = moviesSlice.actions

// Selectors
export const selectFilteredMovies = (state: { movies: MoviesState }) => {
  const { movies, searchQuery, showFavoritesOnly, favoriteMovieIds } = state.movies
  let filtered = movies

  // Filter by search query
  if (searchQuery.trim()) {
    filtered = filtered.filter(movie => 
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.genre.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  // Filter by favorites
  if (showFavoritesOnly) {
    filtered = filtered.filter(movie => favoriteMovieIds.includes(movie.id))
  }

  return filtered
}

// Export slice and reducer
export { moviesSlice }
export default moviesSlice.reducer
