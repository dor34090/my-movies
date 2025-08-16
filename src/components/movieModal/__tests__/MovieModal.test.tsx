import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, mockMovie, mockInitialState } from '../../../test/test-utils'
import MovieModal from '../MovieModal'

// Mock Redux async thunks
vi.mock('../../../store/moviesSlice', async () => {
  const actual = await vi.importActual('../../../store/moviesSlice')
  return {
    ...actual,
    addMovieAsync: vi.fn(() => ({
      type: 'movies/addMovieAsync/pending',
      unwrap: vi.fn(() => Promise.resolve({ id: 1, title: 'New Movie' }))
    })),
    editMovieAsync: vi.fn(() => ({
      type: 'movies/editMovieAsync/pending', 
      unwrap: vi.fn(() => Promise.resolve({ id: 1, title: 'Updated Movie' }))
    }))
  }
})

describe('MovieModal', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders modal when isOpen is true', () => {
    renderWithProviders(
      <MovieModal
        isOpen={true}
        onClose={mockOnClose}
        movie={null}
      />,
      { preloadedState: mockInitialState }
    )

    expect(screen.getByText('Add New Movie')).toBeInTheDocument()
    expect(screen.getByLabelText('Title *')).toBeInTheDocument()
    expect(screen.getByLabelText('Year *')).toBeInTheDocument()
    expect(screen.getByLabelText('Genre *')).toBeInTheDocument()
    expect(screen.getByLabelText('Director *')).toBeInTheDocument()
    expect(screen.getByLabelText('Runtime *')).toBeInTheDocument()

  })

  it('does not render modal when isOpen is false', () => {
    renderWithProviders(
      <MovieModal
        isOpen={false}
        onClose={mockOnClose}
        movie={null}
      />,
      { preloadedState: mockInitialState }
    )

    expect(screen.queryByText('Add New Movie')).not.toBeInTheDocument()
  })

  it('shows "Edit Movie" title when editing existing movie', () => {
    renderWithProviders(
      <MovieModal
        isOpen={true}
        onClose={mockOnClose}
        movie={mockMovie}
      />,
      { preloadedState: mockInitialState }
    )

    expect(screen.getByText('Edit Movie')).toBeInTheDocument()
  })

  it('pre-fills form when editing existing movie', () => {
    renderWithProviders(
      <MovieModal
        isOpen={true}
        onClose={mockOnClose}
        movie={mockMovie}
      />,
      { preloadedState: mockInitialState }
    )

    expect(screen.getByDisplayValue('Test Movie')).toBeInTheDocument()
    expect(screen.getByDisplayValue('2023')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Action')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Test Director')).toBeInTheDocument()
    expect(screen.getByDisplayValue('120')).toBeInTheDocument()

  })

  it('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup()
    
    renderWithProviders(
      <MovieModal
        isOpen={true}
        onClose={mockOnClose}
        movie={null}
      />,
      { preloadedState: mockInitialState }
    )

    const cancelButton = screen.getByText('Cancel')
    await user.click(cancelButton)

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    
    renderWithProviders(
      <MovieModal
        isOpen={true}
        onClose={mockOnClose}
        movie={null}
      />,
      { preloadedState: mockInitialState }
    )

    const submitButton = screen.getByText('Add Movie')
    await user.click(submitButton)

    // Should show validation errors for required fields
    expect(screen.getByText('Title is required')).toBeInTheDocument()
    expect(screen.getByText('Year is required')).toBeInTheDocument()
    expect(screen.getByText('Genre is required')).toBeInTheDocument()
    expect(screen.getByText('Director is required')).toBeInTheDocument()
  })

  it('validates year format', async () => {
    const user = userEvent.setup()
    
    renderWithProviders(
      <MovieModal
        isOpen={true}
        onClose={mockOnClose}
        movie={null}
      />,
      { preloadedState: mockInitialState }
    )

    const yearInput = screen.getByLabelText('Year *')
    await user.type(yearInput, 'invalid')
    
    const submitButton = screen.getByText('Add Movie')
    await user.click(submitButton)

    expect(screen.getByText('Year must be a 4-digit number')).toBeInTheDocument()
  })

  it('validates runtime is required', async () => {
    const user = userEvent.setup()
    
    renderWithProviders(
      <MovieModal
        isOpen={true}
        onClose={mockOnClose}
        movie={null}
      />,
      { preloadedState: mockInitialState }
    )

    // Leave runtime field empty and submit
    const submitButton = screen.getByText('Add Movie')
    await user.click(submitButton)

    expect(screen.getByText('Runtime is required')).toBeInTheDocument()
  })

  it('shows user confirmation modal when form is valid and no username is set', async () => {
    const user = userEvent.setup()
    const stateWithoutUsername = {
      ...mockInitialState,
      movies: {
        ...mockInitialState.movies!,
        currentUsername: ''
      }
    }
    
    renderWithProviders(
      <MovieModal
        isOpen={true}
        onClose={mockOnClose}
        movie={null}
      />,
      { preloadedState: stateWithoutUsername }
    )

    // Fill in valid form data
    await user.type(screen.getByLabelText('Title *'), 'New Movie')
    await user.type(screen.getByLabelText('Year *'), '2023')
    await user.type(screen.getByLabelText('Genre *'), 'Drama')
    await user.type(screen.getByLabelText('Director *'), 'New Director')
    await user.type(screen.getByLabelText('Runtime *'), '90')
    
    const submitButton = screen.getByText('Add Movie')
    await user.click(submitButton)

    // Should show user confirmation modal
    expect(screen.getByText('Confirm Movie Creation')).toBeInTheDocument()
  })

  it('clears form when modal is closed and reopened', async () => {
    const { rerender } = renderWithProviders(
      <MovieModal
        isOpen={true}
        onClose={mockOnClose}
        movie={null}
      />,
      { preloadedState: mockInitialState }
    )

    const titleInput = screen.getByLabelText('Title *') as HTMLInputElement
    fireEvent.change(titleInput, { target: { value: 'Test Title' } })
    expect(titleInput.value).toBe('Test Title')

    // Close modal
    rerender(
      <MovieModal
        isOpen={false}
        onClose={mockOnClose}
        movie={null}
      />
    )

    // Reopen modal
    rerender(
      <MovieModal
        isOpen={true}
        onClose={mockOnClose}
        movie={null}
      />
    )

    const newTitleInput = screen.getByLabelText('Title *') as HTMLInputElement
    expect(newTitleInput.value).toBe('')
  })

  it('handles form submission with username confirmation', async () => {
    const user = userEvent.setup()
    const stateWithoutUsername = {
      ...mockInitialState,
      movies: {
        ...mockInitialState.movies!,
        currentUsername: ''
      }
    }
    
    renderWithProviders(
      <MovieModal
        isOpen={true}
        onClose={mockOnClose}
        movie={null}
      />,
      { preloadedState: stateWithoutUsername }
    )

    // Fill in valid form data
    await user.type(screen.getByLabelText('Title *'), 'New Movie')
    await user.type(screen.getByLabelText('Year *'), '2023')
    await user.type(screen.getByLabelText('Runtime *'), '90')
    await user.type(screen.getByLabelText('Genre *'), 'Drama')
    await user.type(screen.getByLabelText('Director *'), 'New Director')
    
    const submitButton = screen.getByText('Add Movie')
    await user.click(submitButton)

    // Should show user confirmation modal
    expect(screen.getByText('Confirm Movie Creation')).toBeInTheDocument()
    
    // Enter username and confirm
    const usernameInput = screen.getByLabelText('Username:')
    await user.type(usernameInput, 'testuser')
    
    const confirmButton = screen.getByText('Confirm')
    await user.click(confirmButton)

    // Modal should close after successful submission
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled()
    })
  })
})
