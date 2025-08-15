import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, mockInitialState } from '../../../test/test-utils'
import MoviesList from '../MoviesList'

// Mock the Redux thunks to prevent them from being dispatched
vi.mock('../../../store/moviesSlice', async () => {
  const actual = await vi.importActual('../../../store/moviesSlice')
  return {
    ...actual,
    fetchMovies: vi.fn(() => ({ type: 'mock/noop' })),
    fetchFavorites: vi.fn(() => ({ type: 'mock/noop' })),
    deleteMovieAsync: vi.fn(() => ({ type: 'mock/noop' })),
    addToFavoritesAsync: vi.fn(() => ({ type: 'mock/noop' })),
    removeFromFavoritesAsync: vi.fn(() => ({ type: 'mock/noop' }))
  }
})

// Mock the child components to focus on MoviesList logic
vi.mock('../MovieCard', () => ({
  default: ({ movie, onEdit, onDelete, onFavoriteRequested }: any) => (
    <div data-testid={`movie-card-${movie.id}`}>
      <h3>{movie.title}</h3>
      <button onClick={() => onEdit(movie)}>Edit</button>
      <button onClick={() => onDelete(movie.id)}>Delete</button>
      <button onClick={() => onFavoriteRequested(movie.id, false)}>Favorite</button>
    </div>
  )
}))

vi.mock('../../movieModal/MovieModal', () => ({
  default: ({ isOpen }: any) => 
    isOpen ? <div data-testid="movie-modal">Movie Modal</div> : null
}))

describe('MoviesList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders movies list correctly', () => {
    renderWithProviders(<MoviesList />, { preloadedState: mockInitialState })

    expect(screen.getByText('Test Movie')).toBeInTheDocument()
    expect(screen.getByText('Another Movie')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    const loadingState = {
      ...mockInitialState,
      movies: {
        ...mockInitialState.movies!,
        loading: true
      }
    }

    renderWithProviders(<MoviesList />, { preloadedState: loadingState })
    expect(screen.getByText('Loading Movies...')).toBeInTheDocument()
  })

  it('shows error state', () => {
    const errorState = {
      ...mockInitialState,
      movies: {
        ...mockInitialState.movies!,
        error: 'Failed to load movies'
      }
    }

    renderWithProviders(<MoviesList />, { preloadedState: errorState })
    expect(screen.getByText('Error: Failed to load movies')).toBeInTheDocument()
  })

  it('shows empty state when no movies', () => {
    const emptyState = {
      ...mockInitialState,
      movies: {
        ...mockInitialState.movies!,
        movies: []
      }
    }

    renderWithProviders(<MoviesList />, { preloadedState: emptyState })
    expect(screen.getByText('No movies available')).toBeInTheDocument()
  })

  it('opens add movie modal when add button is clicked', async () => {
    const user = userEvent.setup()
    
    renderWithProviders(<MoviesList />, { preloadedState: mockInitialState })

    const addButton = screen.getByText('Add Movie')
    await user.click(addButton)

    expect(screen.getByTestId('movie-modal')).toBeInTheDocument()
  })

  it('opens edit movie modal when edit is triggered', async () => {
    const user = userEvent.setup()
    
    renderWithProviders(<MoviesList />, { preloadedState: mockInitialState })

    const editButton = screen.getAllByText('Edit')[0]
    await user.click(editButton)

    expect(screen.getByTestId('movie-modal')).toBeInTheDocument()
  })

  it('shows user confirmation modal for delete action', async () => {
    const user = userEvent.setup()
    
    renderWithProviders(<MoviesList />, { preloadedState: mockInitialState })

    const deleteButton = screen.getAllByText('Delete')[0]
    await user.click(deleteButton)

    expect(screen.getByText('Delete Movie')).toBeInTheDocument()
  })

  it('shows user confirmation modal for favorites when no username', async () => {
    const user = userEvent.setup()
    const stateWithoutUsername = {
      ...mockInitialState,
      movies: {
        ...mockInitialState.movies!,
        currentUsername: ''
      }
    }
    
    renderWithProviders(<MoviesList />, { preloadedState: stateWithoutUsername })

    const favoriteButton = screen.getAllByText('Favorite')[0]
    await user.click(favoriteButton)

    expect(screen.getByText('Confirm Username for Favorites')).toBeInTheDocument()
  })

  it('filters movies by search query', () => {
    const stateWithSearch = {
      ...mockInitialState,
      movies: {
        ...mockInitialState.movies!,
        searchQuery: 'Test'
      }
    }

    renderWithProviders(<MoviesList />, { preloadedState: stateWithSearch })

    expect(screen.getByText('Test Movie')).toBeInTheDocument()
    expect(screen.queryByText('Another Movie')).not.toBeInTheDocument()
  })

  it('filters movies by favorites only', () => {
    const stateWithFavoritesFilter = {
      ...mockInitialState,
      movies: {
        ...mockInitialState.movies!,
        showFavoritesOnly: true,
        favoriteMovieIds: [1]
      }
    }

    renderWithProviders(<MoviesList />, { preloadedState: stateWithFavoritesFilter })

    expect(screen.getByText('Test Movie')).toBeInTheDocument()
    expect(screen.queryByText('Another Movie')).not.toBeInTheDocument()
  })

  it('shows correct movie count', () => {
    renderWithProviders(<MoviesList />, { preloadedState: mockInitialState })
    expect(screen.getByText(/2.*movies/)).toBeInTheDocument()
  })

  it('shows filtered movie count', () => {
    const stateWithSearch = {
      ...mockInitialState,
      movies: {
        ...mockInitialState.movies!,
        searchQuery: 'Test'
      }
    }

    renderWithProviders(<MoviesList />, { preloadedState: stateWithSearch })
    expect(screen.getByText(/1.*of.*2.*movies/)).toBeInTheDocument()
  })

  it('handles search input changes', async () => {
    const user = userEvent.setup()
    
    renderWithProviders(<MoviesList />, { preloadedState: mockInitialState })

    const searchInput = screen.getByPlaceholderText('Search movies...')
    await user.type(searchInput, 'Test')

    // The search should filter the results
    await waitFor(() => {
      expect(screen.getByText('Test Movie')).toBeInTheDocument()
      expect(screen.queryByText('Another Movie')).not.toBeInTheDocument()
    })
  })

  it('handles favorites filter toggle', async () => {
    const user = userEvent.setup()
    
    renderWithProviders(<MoviesList />, { preloadedState: mockInitialState })

    const favoritesButton = screen.getByText('Favorites Only')
    await user.click(favoritesButton)

    // Should show only favorited movies (none in this case)
    await waitFor(() => {
      expect(screen.getByText('No movies found')).toBeInTheDocument()
    })
  })

  it('shows favorites confirmation modal when toggling filter without username', async () => {
    const user = userEvent.setup()
    const stateWithoutUsername = {
      ...mockInitialState,
      movies: {
        ...mockInitialState.movies!,
        currentUsername: ''
      }
    }
    
    renderWithProviders(<MoviesList />, { preloadedState: stateWithoutUsername })

    const favoritesButton = screen.getByText('Favorites Only')
    await user.click(favoritesButton)

    expect(screen.getByText('Confirm Username for Favorites')).toBeInTheDocument()
  })

  it('closes modal when cancel is clicked', async () => {
    const user = userEvent.setup()
    
    renderWithProviders(<MoviesList />, { preloadedState: mockInitialState })

    // Open delete confirmation modal
    const deleteButton = screen.getAllByText('Delete')[0]
    await user.click(deleteButton)

    expect(screen.getByText('Delete Movie')).toBeInTheDocument()

    // Cancel the action
    const cancelButton = screen.getByText('Cancel')
    await user.click(cancelButton)

    expect(screen.queryByText('Delete Movie')).not.toBeInTheDocument()
  })
})
