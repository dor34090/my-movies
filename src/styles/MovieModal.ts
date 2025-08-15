import styled from 'styled-components'
import { FlexRow, FlexColumn } from './Globals'

export const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
`

export const ModalContainer = styled.div`
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    max-width: 500px;
    width: 100%;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
`

export const ModalHeader = styled(FlexRow)`
    padding: 24px;
    border-bottom: 1px solid #e5e7eb;
    justify-content: space-between;
    align-items: center;
`

export const ModalTitle = styled.h2`
    font-size: 24px;
    font-weight: 600;
    color: #111827;
    margin: 0;
`

export const CloseButton = styled.button`
    background: none;
    border: none;
    font-size: 28px;
    color: #6b7280;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: all 0.2s ease;
    
    &:hover {
        background-color: #f3f4f6;
        color: #374151;
    }
`

export const ModalBody = styled.div`
    padding: 24px;
    overflow-y: auto;
    flex: 1;
`

export const FormGroup = styled(FlexColumn)`
    margin-bottom: 20px;
    gap: 6px;
`

export const FormLabel = styled.label`
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 6px;
`

export const FormInput = styled.input<{ hasError?: boolean }>`
    padding: 12px 16px;
    border: 2px solid ${props => props.hasError ? '#ef4444' : '#d1d5db'};
    border-radius: 8px;
    font-size: 16px;
    background-color: white;
    color: #111827;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    
    &:focus {
        outline: none;
        border-color: ${props => props.hasError ? '#ef4444' : '#3b82f6'};
        box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)'};
    }
    
    &::placeholder {
        color: #9ca3af;
    }
`

export const FormTextarea = styled.textarea`
    padding: 12px 16px;
    border: 2px solid #d1d5db;
    border-radius: 8px;
    font-size: 16px;
    background-color: white;
    color: #111827;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    resize: vertical;
    min-height: 100px;
    font-family: inherit;
    
    &:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    &::placeholder {
        color: #9ca3af;
    }
`

export const ErrorMessage = styled.span`
    font-size: 14px;
    color: #ef4444;
    margin-top: 4px;
`

export const ModalFooter = styled(FlexRow)`
    padding: 24px;
    border-top: 1px solid #e5e7eb;
    justify-content: flex-end;
    gap: 12px;
    background-color: #f9fafb;
`

export const CancelButton = styled.button`
    padding: 12px 24px;
    border: 2px solid #d1d5db;
    border-radius: 8px;
    background-color: white;
    color: #374151;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background-color: #f3f4f6;
        border-color: #9ca3af;
    }
`

export const SaveButton = styled.button`
    padding: 12px 24px;
    border: 2px solid #3b82f6;
    border-radius: 8px;
    background-color: #3b82f6;
    color: white;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover:not(:disabled) {
        background-color: #2563eb;
        border-color: #2563eb;
    }
    
    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`
