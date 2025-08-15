import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, mockInitialState } from '../../../test/test-utils'
import UserConfirmationModal from '../UserConfirmationModal'

describe('UserConfirmationModal', () => {
  const mockOnConfirm = vi.fn()
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders modal when isOpen is true', () => {
    renderWithProviders(
      <UserConfirmationModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        actionType="delete"
        title="Delete Movie"
        movieTitle="Test Movie"
      />,
      { preloadedState: mockInitialState }
    )

    expect(screen.getByText('Delete Movie')).toBeInTheDocument()
    expect(screen.getByText(/Test Movie/)).toBeInTheDocument()
    expect(screen.getByLabelText('Username:')).toBeInTheDocument()
  })

  it('does not render modal when isOpen is false', () => {
    renderWithProviders(
      <UserConfirmationModal
        isOpen={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        actionType="delete"
        title="Delete Movie"
      />,
      { preloadedState: mockInitialState }
    )

    expect(screen.queryByText('Delete Movie')).not.toBeInTheDocument()
  })

  it('displays current username when available', () => {
    renderWithProviders(
      <UserConfirmationModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        actionType="delete"
        title="Delete Movie"
      />,
      { preloadedState: mockInitialState }
    )

    const usernameInput = screen.getByRole('textbox') as HTMLInputElement
    expect(usernameInput.value).toBe('testuser')
  })

  it('shows empty input when no current username', () => {
    const stateWithoutUsername = {
      ...mockInitialState,
      movies: {
        ...mockInitialState.movies!,
        currentUsername: ''
      }
    }

    renderWithProviders(
      <UserConfirmationModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        actionType="delete"
        title="Delete Movie"
      />,
      { preloadedState: stateWithoutUsername }
    )

    const usernameInput = screen.getByRole('textbox') as HTMLInputElement
    expect(usernameInput.value).toBe('')
  })

  it('calls onConfirm with username when confirm button is clicked', async () => {
    const user = userEvent.setup()
    
    renderWithProviders(
      <UserConfirmationModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        actionType="delete"
        title="Delete Movie"
      />,
      { preloadedState: mockInitialState }
    )

    const confirmButton = screen.getByText('Confirm')
    await user.click(confirmButton)

    expect(mockOnConfirm).toHaveBeenCalledWith('testuser')
  })

  it('calls onConfirm with entered username', async () => {
    const user = userEvent.setup()
    const stateWithoutUsername = {
      ...mockInitialState,
      movies: {
        ...mockInitialState.movies!,
        currentUsername: ''
      }
    }
    
    renderWithProviders(
      <UserConfirmationModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        actionType="delete"
        title="Delete Movie"
      />,
      { preloadedState: stateWithoutUsername }
    )

    const usernameInput = screen.getByRole('textbox')
    await user.type(usernameInput, 'newuser')
    
    const confirmButton = screen.getByText('Confirm')
    await user.click(confirmButton)

    expect(mockOnConfirm).toHaveBeenCalledWith('newuser')
  })

  it('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup()
    
    renderWithProviders(
      <UserConfirmationModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        actionType="delete"
        title="Delete Movie"
      />,
      { preloadedState: mockInitialState }
    )

    const cancelButton = screen.getByText('Cancel')
    await user.click(cancelButton)

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('calls onClose when overlay is clicked', async () => {
    const user = userEvent.setup()
    
    renderWithProviders(
      <UserConfirmationModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        actionType="delete"
        title="Delete Movie"
      />,
      { preloadedState: mockInitialState }
    )

    const cancelButton = screen.getByText('Cancel')
    await user.click(cancelButton)

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('shows different action descriptions for different action types', () => {
    const { rerender } = renderWithProviders(
      <UserConfirmationModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        actionType="delete"
        title="Delete Movie"
        movieTitle="Test Movie"
      />,
      { preloadedState: mockInitialState }
    )

    expect(screen.getByText(/delete.*Test Movie/i)).toBeInTheDocument()

    rerender(
      <UserConfirmationModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        actionType="create"
        title="Create Movie"
      />
    )

    expect(screen.getByText(/create.*movie/i)).toBeInTheDocument()
  })

  it('disables confirm button when username is empty', () => {
    const stateWithoutUsername = {
      ...mockInitialState,
      movies: {
        ...mockInitialState.movies!,
        currentUsername: ''
      }
    }
    
    renderWithProviders(
      <UserConfirmationModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        actionType="delete"
        title="Delete Movie"
      />,
      { preloadedState: stateWithoutUsername }
    )

    const confirmButton = screen.getByText('Confirm')
    expect(confirmButton).toBeDisabled()
  })

  it('enables confirm button when username is provided', async () => {
    const user = userEvent.setup()
    const stateWithoutUsername = {
      ...mockInitialState,
      movies: {
        ...mockInitialState.movies!,
        currentUsername: ''
      }
    }
    
    renderWithProviders(
      <UserConfirmationModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        actionType="delete"
        title="Delete Movie"
      />,
      { preloadedState: stateWithoutUsername }
    )

    const usernameInput = screen.getByRole('textbox')
    await user.type(usernameInput, 'testuser')
    
    const confirmButton = screen.getByText('Confirm')
    expect(confirmButton).not.toBeDisabled()
  })
})
