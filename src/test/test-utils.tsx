import React, { type PropsWithChildren } from 'react'
import { render } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import type { RenderOptions } from '@testing-library/react'
import moviesReducer from '../store/moviesSlice'
import type { RootState } from '../store/store'
import type { Reducer } from 'redux'
import type { MoviesState } from '../store/moviesSlice'
import type { Action } from 'redux'

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Partial<RootState>
  store?: ReturnType<typeof configureStore>
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = configureStore({
      reducer: {
        movies: moviesReducer as Reducer<MoviesState, Action, MoviesState | undefined>,
      },
      preloadedState,
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren): React.JSX.Element {
    return (
      <Provider store={store}>
        <MemoryRouter>
          {children}
        </MemoryRouter>
      </Provider>
    )
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}

// Mock movie data for testing
export const mockMovie = {
  id: 1,
  title: 'Test Movie',
  year: '2023',
  genre: 'Action',
  director: 'Test Director',
  runtime: '120'
}

export const mockMovies = [
  mockMovie,
  {
    id: 2,
    title: 'Another Movie',
    year: '2022',
    genre: 'Comedy',
    director: 'Another Director',
    runtime: '90'
  }
]

// Mock Redux state
export const mockInitialState: Partial<RootState> = {
  movies: {
    movies: mockMovies,
    selectedMovie: null,
    loading: false,
    error: null,
    searchQuery: '',
    showFavoritesOnly: false,
    favoriteMovieIds: [],
    currentUsername: 'testuser',
    favorites: [],
    searchResults: [],
    isSearching: false,
    allMovies: mockMovies
  }
}
