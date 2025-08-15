import React from 'react'
import {
    ModalOverlay,
    ModalContainer,
    ModalHeader,
    ModalTitle,
    ModalBody,
    ModalFooter,
    ConfirmButton,
    CancelButton
} from '../../styles/ConfirmationModal.ts'

interface ConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    confirmText?: string
    cancelText?: string
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel'
}) => {
    if (!isOpen) return null

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    const handleConfirm = () => {
        onConfirm()
        onClose()
    }

    return (
        <ModalOverlay onClick={handleOverlayClick}>
            <ModalContainer>
                <ModalHeader>
                    <ModalTitle>{title}</ModalTitle>
                </ModalHeader>
                
                <ModalBody>
                    <p>{message}</p>
                </ModalBody>

                <ModalFooter>
                    <CancelButton onClick={onClose}>
                        {cancelText}
                    </CancelButton>
                    <ConfirmButton onClick={handleConfirm}>
                        {confirmText}
                    </ConfirmButton>
                </ModalFooter>
            </ModalContainer>
        </ModalOverlay>
    )
}

export default ConfirmationModal
