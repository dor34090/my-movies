import { describe, it, expect, vi, beforeEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import { moviesSlice, setSearchQuery, toggleShowFavoritesOnly, setCurrentUsername } from '../moviesSlice'
import type { MoviesState } from '../moviesSlice'

// Mock the API
vi.mock('../../api/moviesApi', () => ({
  fetchMovies: vi.fn(),
  fetchMovieById: vi.fn(),
  addMovie: vi.fn(),
  editMovie: vi.fn(),
  deleteMovie: vi.fn(),
  fetchFavorites: vi.fn(),
  addToFavorites: vi.fn(),
  removeFromFavorites: vi.fn(),
}))

describe('moviesSlice', () => {
  let store: ReturnType<typeof configureStore<{ movies: MoviesState }>>
  
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
    searchResults: [],
    isSearching: false,
    allMovies: []
  }

  beforeEach(() => {
    store = configureStore({
      reducer: {
        movies: moviesSlice.reducer
      }
    })
  })

  describe('synchronous actions', () => {
    it('should handle setSearchQuery', () => {
      store.dispatch(setSearchQuery('test query'))
      
      const state = store.getState().movies
      expect(state.searchQuery).toBe('test query')
    })

    it('should handle toggleShowFavoritesOnly', () => {
      // Initially false
      expect(store.getState().movies.showFavoritesOnly).toBe(false)
      
      store.dispatch(toggleShowFavoritesOnly())
      expect(store.getState().movies.showFavoritesOnly).toBe(true)
      
      store.dispatch(toggleShowFavoritesOnly())
      expect(store.getState().movies.showFavoritesOnly).toBe(false)
    })

    it('should handle setCurrentUsername', () => {
      store.dispatch(setCurrentUsername('testuser'))
      
      const state = store.getState().movies
      expect(state.currentUsername).toBe('testuser')
    })
  })

  describe('async thunks', () => {
    it('should handle fetchMovies pending state', () => {
      const action = { type: 'movies/fetchMovies/pending' }
      const state = moviesSlice.reducer(initialState, action)
      
      expect(state.loading).toBe(true)
      expect(state.error).toBe(null)
    })

    it('should handle fetchMovies fulfilled state', () => {
      const mockMovies = [
        { id: 1, title: 'Movie 1', year: '2023', genre: 'Action', director: 'Director 1', runtime: '120', description: 'Description 1' },
        { id: 2, title: 'Movie 2', year: '2022', genre: 'Comedy', director: 'Director 2', runtime: '90', description: 'Description 2' }
      ]
      
      const action = { 
        type: 'movies/fetchMovies/fulfilled', 
        payload: mockMovies 
      }
      const state = moviesSlice.reducer(initialState, action)
      
      expect(state.loading).toBe(false)
      expect(state.error).toBe(null)
      expect(state.movies).toEqual(mockMovies)
    })

    it('should handle fetchMovies rejected state', () => {
      const action = { 
        type: 'movies/fetchMovies/rejected', 
        error: { message: 'Failed to fetch movies' }
      }
      const state = moviesSlice.reducer(initialState, action)
      
      expect(state.loading).toBe(false)
      expect(state.error).toBe('Failed to fetch movies')
    })

    it('should handle addMovieAsync fulfilled state', () => {
      const newMovie = { 
        id: 3, 
        title: 'New Movie', 
        year: '2023', 
        genre: 'Drama', 
        director: 'New Director', 
        runtime: '100', 
        description: 'New Description' 
      }
      
      const stateWithMovies = {
        ...initialState,
        movies: [
          { id: 1, title: 'Movie 1', year: '2023', genre: 'Action', director: 'Director 1', runtime: '120', description: 'Description 1' }
        ]
      }
      
      const action = { 
        type: 'movies/addMovie/fulfilled', 
        payload: newMovie 
      }
      const state = moviesSlice.reducer(stateWithMovies, action)
      
      expect(state.loading).toBe(false)
      expect(state.error).toBe(null)
      expect(state.movies).toHaveLength(2)
      expect(state.movies[1]).toEqual(newMovie)
    })

    it('should handle editMovieAsync fulfilled state', () => {
      const existingMovie = { 
        id: 1, 
        title: 'Movie 1', 
        year: '2023', 
        genre: 'Action', 
        director: 'Director 1', 
        runtime: '120', 
        description: 'Description 1' 
      }
      
      const updatedMovie = { 
        ...existingMovie, 
        title: 'Updated Movie 1' 
      }
      
      const stateWithMovies = {
        ...initialState,
        movies: [existingMovie]
      }
      
      const action = { 
        type: 'movies/editMovie/fulfilled', 
        payload: updatedMovie 
      }
      const state = moviesSlice.reducer(stateWithMovies, action)
      
      expect(state.loading).toBe(false)
      expect(state.error).toBe(null)
      expect(state.movies[0].title).toBe('Updated Movie 1')
    })

    it('should handle deleteMovieAsync fulfilled state', () => {
      const stateWithMovies = {
        ...initialState,
        movies: [
          { id: 1, title: 'Movie 1', year: '2023', genre: 'Action', director: 'Director 1', runtime: '120', description: 'Description 1' },
          { id: 2, title: 'Movie 2', year: '2022', genre: 'Comedy', director: 'Director 2', runtime: '90', description: 'Description 2' }
        ]
      }
      
      const action = { 
        type: 'movies/deleteMovie/fulfilled', 
        payload: 1 
      }
      const state = moviesSlice.reducer(stateWithMovies, action)
      
      expect(state.loading).toBe(false)
      expect(state.error).toBe(null)
      expect(state.movies).toHaveLength(1)
      expect(state.movies[0].id).toBe(2)
    })

    it('should handle fetchFavorites fulfilled state', () => {
      const mockFavoriteMovies = [
        { id: 1, title: 'Movie 1', year: '2021', genre: 'Action', director: 'Director 1', runtime: '120' },
        { id: 3, title: 'Movie 3', year: '2022', genre: 'Drama', director: 'Director 3', runtime: '110' },
        { id: 5, title: 'Movie 5', year: '2023', genre: 'Comedy', director: 'Director 5', runtime: '100' }
      ]
      
      const action = { 
        type: 'movies/fetchFavorites/fulfilled', 
        payload: mockFavoriteMovies 
      }
      const state = moviesSlice.reducer(initialState, action)
      
      expect(state.loading).toBe(false)
      expect(state.error).toBe(null)
      expect(state.favoriteMovieIds).toEqual([1, 3, 5])
      expect(state.favorites).toEqual(mockFavoriteMovies)
    })

    it('should handle addToFavoritesAsync fulfilled state', () => {
      const stateWithFavorites = {
        ...initialState,
        favoriteMovieIds: [1, 2]
      }
      
      const action = { 
        type: 'movies/addToFavorites/fulfilled', 
        payload: 3 
      }
      const state = moviesSlice.reducer(stateWithFavorites, action)
      
      expect(state.loading).toBe(false)
      expect(state.error).toBe(null)
      expect(state.favoriteMovieIds).toEqual([1, 2, 3])
    })

    it('should handle removeFromFavoritesAsync fulfilled state', () => {
      const stateWithFavorites = {
        ...initialState,
        favoriteMovieIds: [1, 2, 3]
      }
      
      const action = { 
        type: 'movies/removeFromFavorites/fulfilled', 
        payload: 2 
      }
      const state = moviesSlice.reducer(stateWithFavorites, action)
      
      expect(state.loading).toBe(false)
      expect(state.error).toBe(null)
      expect(state.favoriteMovieIds).toEqual([1, 3])
    })

    it('should handle fetchMovieById fulfilled state', () => {
      const mockMovie = { 
        id: 1, 
        title: 'Selected Movie', 
        year: 2023, 
        genre: 'Action', 
        director: 'Director', 
        runtime: 120, 
        description: 'Description' 
      }
      
      const action = { 
        type: 'movies/fetchMovieById/fulfilled', 
        payload: mockMovie 
      }
      const state = moviesSlice.reducer(initialState, action)
      
      expect(state.loading).toBe(false)
      expect(state.error).toBe(null)
      expect(state.selectedMovie).toEqual(mockMovie)
    })
  })

  describe('error handling', () => {
    it('should handle async thunk rejections', () => {
      const errorMessage = 'Network error'
      const action = { 
        type: 'movies/fetchMovies/rejected', 
        error: { message: errorMessage }
      }
      const state = moviesSlice.reducer(initialState, action)
      
      expect(state.loading).toBe(false)
      expect(state.error).toBe(errorMessage)
    })

    it('should clear error on successful operations', () => {
      const stateWithError = {
        ...initialState,
        error: 'Previous error'
      }
      
      const action = { 
        type: 'movies/fetchMovies/fulfilled', 
        payload: [] 
      }
      const state = moviesSlice.reducer(stateWithError, action)
      
      expect(state.error).toBe(null)
    })
  })
})
