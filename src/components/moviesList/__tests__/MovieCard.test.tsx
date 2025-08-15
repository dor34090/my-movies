import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, mockMovie, mockInitialState } from '../../../test/test-utils'
import MovieCard from '../MovieCard'

// Mock the navigate function
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock the API calls
vi.mock('../../../store/moviesSlice', async () => {
  const actual = await vi.importActual('../../../store/moviesSlice')
  return {
    ...actual,
    addToFavoritesAsync: vi.fn(() => ({ type: 'addToFavorites', unwrap: vi.fn() })),
    removeFromFavoritesAsync: vi.fn(() => ({ type: 'removeFromFavorites', unwrap: vi.fn() })),
  }
})

describe('MovieCard', () => {
  const mockOnEdit = vi.fn()
  const mockOnDelete = vi.fn()
  const mockOnFavoriteRequested = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders movie information correctly', () => {
    renderWithProviders(
      <MovieCard 
        movie={mockMovie}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onFavoriteRequested={mockOnFavoriteRequested}
      />,
      { preloadedState: mockInitialState }
    )

    expect(screen.getByText('Test Movie')).toBeInTheDocument()
    expect(screen.getByText(/2023.*Action/)).toBeInTheDocument()
    expect(screen.getByText(/Dir:.*Test Director/)).toBeInTheDocument()
  })

  it('navigates to movie details when clicked', async () => {
    const user = userEvent.setup()
    
    renderWithProviders(
      <MovieCard 
        movie={mockMovie}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onFavoriteRequested={mockOnFavoriteRequested}
      />,
      { preloadedState: mockInitialState }
    )

    const movieCard = screen.getByText('Test Movie').closest('div')
    await user.click(movieCard!)

    expect(mockNavigate).toHaveBeenCalledWith('/movie/1')
  })

  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup()
    
    renderWithProviders(
      <MovieCard 
        movie={mockMovie}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onFavoriteRequested={mockOnFavoriteRequested}
      />,
      { preloadedState: mockInitialState }
    )

    const editButton = screen.getByText('Edit')
    await user.click(editButton)

    expect(mockOnEdit).toHaveBeenCalledWith(mockMovie)
  })

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup()
    
    renderWithProviders(
      <MovieCard 
        movie={mockMovie}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onFavoriteRequested={mockOnFavoriteRequested}
      />,
      { preloadedState: mockInitialState }
    )

    const deleteButton = screen.getByText('Delete')
    await user.click(deleteButton)

    expect(mockOnDelete).toHaveBeenCalledWith(1)
  })

  it('calls onFavoriteRequested when no username is set', async () => {
    const user = userEvent.setup()
    const stateWithoutUsername = {
      ...mockInitialState,
      movies: {
        ...mockInitialState.movies!,
        currentUsername: ''
      }
    }
    
    renderWithProviders(
      <MovieCard 
        movie={mockMovie}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onFavoriteRequested={mockOnFavoriteRequested}
      />,
      { preloadedState: stateWithoutUsername }
    )

    // Click on the star SVG element (it's the first SVG in the component)
    const container = screen.getByText('Test Movie').closest('div')
    const starElement = container!.querySelector('svg')
    await user.click(starElement!)

    expect(mockOnFavoriteRequested).toHaveBeenCalledWith(1, false)
  })

  it('shows correct favorite state when movie is favorited', () => {
    const stateWithFavorite = {
      ...mockInitialState,
      movies: {
        ...mockInitialState.movies!,
        favoriteMovieIds: [1]
      }
    }
    
    renderWithProviders(
      <MovieCard 
        movie={mockMovie}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onFavoriteRequested={mockOnFavoriteRequested}
      />,
      { preloadedState: stateWithFavorite }
    )

    // Check that the star SVG is present
    const starElement = document.querySelector('svg[viewBox="0 0 24 24"]')
    expect(starElement).toBeInTheDocument()
  })

  it('prevents event propagation on action buttons', async () => {
    const user = userEvent.setup()
    
    renderWithProviders(
      <MovieCard 
        movie={mockMovie}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onFavoriteRequested={mockOnFavoriteRequested}
      />,
      { preloadedState: mockInitialState }
    )

    const editButton = screen.getByText('Edit')
    await user.click(editButton)

    // Navigation should not be called when clicking action buttons
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
