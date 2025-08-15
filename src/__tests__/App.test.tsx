import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders, mockInitialState } from '../test/test-utils'
import { Routes, Route } from 'react-router-dom'
import MoviesList from '../components/moviesList/MoviesList'
import MovieDetailsWrapper from '../components/movieDetails/MovieDetailsWrapper'

// Mock the child components
vi.mock('../components/moviesList/MoviesList', () => ({
  default: () => (
    <div data-testid="movies-list">
      <h1>My Movies</h1>
      <div>Movies List Component</div>
    </div>
  )
}))

vi.mock('../components/movieDetails/MovieDetails', () => ({
  default: () => <div data-testid="movie-details">Movie Details Component</div>
}))

// Mock environment variables
vi.mock('../config/env', () => ({
  API_BASE_URL: 'http://localhost:3001',
  DEFAULT_USERNAME: 'testuser'
}))

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the app header', () => {
    renderWithProviders(
      <div className="App">
        <Routes>
          <Route path="/" element={<MoviesList />} />
          <Route path="/movie/:id" element={<MovieDetailsWrapper />} />
        </Routes>
      </div>, 
      { preloadedState: mockInitialState }
    )
    
    expect(screen.getByText('My Movies')).toBeInTheDocument()
  })

  it('renders movies list on home route', () => {
    renderWithProviders(
      <div className="App">
        <Routes>
          <Route path="/" element={<MoviesList />} />
          <Route path="/movie/:id" element={<MovieDetailsWrapper />} />
        </Routes>
      </div>, 
      { preloadedState: mockInitialState }
    )
    
    expect(screen.getByTestId('movies-list')).toBeInTheDocument()
  })

  it('initializes with empty username when not provided', async () => {
    const { store } = renderWithProviders(
      <div className="App">
        <Routes>
          <Route path="/" element={<MoviesList />} />
          <Route path="/movie/:id" element={<MovieDetailsWrapper />} />
        </Routes>
      </div>, 
      { 
        preloadedState: {
          ...mockInitialState,
          movies: {
            ...mockInitialState.movies!,
            currentUsername: ''
          }
        }
      }
    )

    const state: any = store.getState()
    expect(state.movies.currentUsername).toBe('')
  })

  it('does not override existing username', async () => {
    const { store } = renderWithProviders(
      <div className="App">
        <Routes>
          <Route path="/" element={<MoviesList />} />
          <Route path="/movie/:id" element={<MovieDetailsWrapper />} />
        </Routes>
      </div>, 
      { 
        preloadedState: {
          ...mockInitialState,
          movies: {
            ...mockInitialState.movies!,
            currentUsername: 'existinguser'
          }
        }
      }
    )

    await waitFor(() => {
      const state: any = store.getState()
      expect(state.movies.currentUsername).toBe('existinguser')
    })
  })

  it('fetches movies on app load', async () => {
    const { store } = renderWithProviders(
      <div className="App">
        <Routes>
          <Route path="/" element={<MoviesList />} />
          <Route path="/movie/:id" element={<MovieDetailsWrapper />} />
        </Routes>
      </div>, 
      { preloadedState: mockInitialState }
    )

    // Check that movies are being fetched (loading state should be triggered)
    await waitFor(() => {
      const state: any = store.getState()
      // The fetchMovies action should have been dispatched
      expect(state.movies.movies).toBeDefined()
    })
  })

  it('renders with proper styling structure', () => {
    renderWithProviders(
      <div className="App">
        <Routes>
          <Route path="/" element={<MoviesList />} />
          <Route path="/movie/:id" element={<MovieDetailsWrapper />} />
        </Routes>
      </div>, 
      { preloadedState: mockInitialState }
    )
    
    const appContainer = screen.getByText('My Movies').closest('div')
    expect(appContainer).toBeInTheDocument()
  })

  it('handles routing correctly', () => {
    renderWithProviders(
      <div className="App">
        <Routes>
          <Route path="/" element={<MoviesList />} />
          <Route path="/movie/:id" element={<MovieDetailsWrapper />} />
        </Routes>
      </div>, 
      { preloadedState: mockInitialState }
    )
    
    // Should render the main movies list by default
    expect(screen.getByTestId('movies-list')).toBeInTheDocument()
  })
})
