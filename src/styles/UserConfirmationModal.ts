import styled from 'styled-components'

export const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
`

export const ModalContainer = styled.div`
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    border-radius: 16px;
    padding: 0;
    width: 90%;
    max-width: 480px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.1);
    overflow: hidden;
    animation: modalSlideIn 0.3s ease-out;
    
    @keyframes modalSlideIn {
        from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
`

export const ModalHeader = styled.div`
    padding: 24px 24px 16px 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.02);
`

export const ModalTitle = styled.h2`
    margin: 0;
    color: #ffffff;
    font-size: 20px;
    font-weight: 600;
    text-align: center;
`

export const ModalBody = styled.div`
    padding: 24px;
    color: #e0e0e0;
`

export const ActionDescription = styled.p`
    margin: 0 0 20px 0;
    color: #b0b0b0;
    font-size: 14px;
    line-height: 1.5;
    text-align: center;
`

export const InputLabel = styled.label`
    display: block;
    margin-bottom: 8px;
    color: #ffffff;
    font-size: 14px;
    font-weight: 500;
`

export const UserInput = styled.input`
    width: 100%;
    padding: 12px 16px;
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.05);
    color: #ffffff;
    font-size: 16px;
    transition: all 0.2s ease;
    box-sizing: border-box;
    
    &:focus {
        outline: none;
        border-color: #4a9eff;
        background: rgba(255, 255, 255, 0.08);
        box-shadow: 0 0 0 3px rgba(74, 158, 255, 0.1);
    }
    
    &::placeholder {
        color: #888888;
    }
    
    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`

export const UserInfo = styled.div`
    margin-top: 12px;
    padding: 8px 12px;
    background: rgba(74, 158, 255, 0.1);
    border: 1px solid rgba(74, 158, 255, 0.2);
    border-radius: 6px;
    color: #b0b0b0;
    font-size: 12px;
    
    strong {
        color: #4a9eff;
    }
`

export const ModalFooter = styled.div`
    padding: 16px 24px 24px 24px;
    display: flex;
    gap: 12px;
    justify-content: flex-end;
`

export const BaseButton = styled.button`
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 80px;
    
    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`

export const CancelButton = styled(BaseButton)`
    background: rgba(255, 255, 255, 0.1);
    color: #e0e0e0;
    border: 1px solid rgba(255, 255, 255, 0.2);
    
    &:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.15);
        transform: translateY(-1px);
    }
`

export const ConfirmButton = styled(BaseButton)`
    background: linear-gradient(135deg, #4a9eff 0%, #0066cc 100%);
    color: white;
    border: 1px solid #4a9eff;
    
    &:hover:not(:disabled) {
        background: linear-gradient(135deg, #5aa8ff 0%, #0077dd 100%);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(74, 158, 255, 0.3);
    }
    
    &:disabled {
        background: #666666;
        border-color: #666666;
    }
`
