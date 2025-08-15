import styled from 'styled-components'

export const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`

export const ModalContainer = styled.div`
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    max-width: 400px;
    width: 90%;
    max-height: 90vh;
    overflow: hidden;
`

export const ModalHeader = styled.div`
    padding: 24px 24px 16px 24px;
    border-bottom: 1px solid #e5e7eb;
`

export const ModalTitle = styled.h2`
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #111827;
`

export const ModalBody = styled.div`
    padding: 16px 24px;
    
    p {
        margin: 0;
        color: #6b7280;
        line-height: 1.5;
    }
`

export const ModalFooter = styled.div`
    padding: 16px 24px 24px 24px;
    display: flex;
    gap: 12px;
    justify-content: flex-end;
`

export const ConfirmButton = styled.button`
    padding: 10px 20px;
    background-color: #dc2626;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
    
    &:hover {
        background-color: #b91c1c;
    }
    
    &:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
    }
`

export const CancelButton = styled.button`
    padding: 10px 20px;
    background-color: #f9fafb;
    color: #374151;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background-color: #f3f4f6;
        border-color: #9ca3af;
    }
    
    &:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(156, 163, 175, 0.1);
    }
`
