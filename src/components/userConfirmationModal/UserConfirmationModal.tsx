import React, { useState, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { setCurrentUsername } from '../../store/moviesSlice'
import {
    ModalOverlay,
    ModalContainer,
    ModalHeader,
    ModalTitle,
    ModalBody,
    ModalFooter,
    ConfirmButton,
    CancelButton
} from '../../styles/ConfirmationModal'
import styled from 'styled-components'

// Additional styled components for user confirmation
const UserInput = styled.input`
    width: calc(100% - 24px);
    padding: 12px;
    border: 2px solid #e0e0e0;
    border-radius: 6px;
    font-size: 16px;
    margin-top: 8px;
    
    &:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
    }
`

const InputLabel = styled.label`
    display: block;
    font-weight: 600;
    color: #333;
    margin-bottom: 4px;
`

const UserInfo = styled.div`
    background-color: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 6px;
    padding: 12px;
    margin-bottom: 16px;
`

const ActionDescription = styled.p`
    color: #666;
    margin-bottom: 20px;
    line-height: 1.5;
`

interface UserConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (username: string) => void
    actionType: 'create' | 'update' | 'delete'
    movieTitle?: string
    title?: string
}

const UserConfirmationModal: React.FC<UserConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    actionType,
    movieTitle,
    title
}) => {
    const dispatch = useAppDispatch()
    const currentUsername = useAppSelector(state => state.movies.currentUsername)
    const [username, setUsername] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setUsername(currentUsername || '')
        }
    }, [isOpen, currentUsername])

    if (!isOpen) return null

    const getActionText = () => {
        switch (actionType) {
            case 'create':
                return 'add this movie'
            case 'update':
                return `update "${movieTitle || 'this movie'}"`
            case 'delete':
                return `delete "${movieTitle || 'this movie'}"`
            default:
                return 'perform this action'
        }
    }

    const getModalTitle = () => {
        if (title) return title
        
        switch (actionType) {
            case 'create':
                return 'Confirm Movie Creation'
            case 'update':
                return 'Confirm Movie Update'
            case 'delete':
                return 'Confirm Movie Deletion'
            default:
                return 'Confirm Action'
        }
    }

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    const handleConfirm = async () => {
        if (!username.trim()) {
            return
        }

        setIsLoading(true)
        
        try {
            // Update the current username in Redux state
            dispatch(setCurrentUsername(username.trim()))
            
            // Call the confirmation callback with the username
            onConfirm(username.trim())
            onClose()
        } catch (error) {
            console.error('Error confirming action:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && username.trim() && !isLoading) {
            handleConfirm()
        }
    }

    return (
        <ModalOverlay onClick={handleOverlayClick}>
            <ModalContainer>
                <ModalHeader>
                    <ModalTitle>{getModalTitle()}</ModalTitle>
                </ModalHeader>
                
                <ModalBody>
                    <ActionDescription>
                        You are about to {getActionText()}. Please confirm your identity to proceed.
                    </ActionDescription>
                    
                    <InputLabel htmlFor="username">Username:</InputLabel>
                    <UserInput
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter your username"
                        autoFocus
                        disabled={isLoading}
                    />
                    
                    {currentUsername && (
                        <UserInfo>
                            Current user: <strong>{currentUsername}</strong>
                        </UserInfo>
                    )}
                </ModalBody>

                <ModalFooter>
                    <CancelButton onClick={onClose} disabled={isLoading}>
                        Cancel
                    </CancelButton>
                    <ConfirmButton 
                        onClick={handleConfirm} 
                        disabled={!username.trim() || isLoading}
                    >
                        {isLoading ? 'Confirming...' : 'Confirm'}
                    </ConfirmButton>
                </ModalFooter>
            </ModalContainer>
        </ModalOverlay>
    )
}

export default UserConfirmationModal
