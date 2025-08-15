import styled from 'styled-components'
import { CenterFlexColumn, FlexColumn, FlexRow } from './Globals'

export const MovieDetailsContainer = styled.div`
    min-height: 100vh;
    width: 100vw;
    background-color: #f4f4f4;
    color: #333;
    padding: 80px;
`

export const MovieDetailsContent = styled(CenterFlexColumn)`
    max-width: 1200px;
    width: 100%;
    padding: 0 20px;
    gap: 40px;
`

export const MovieHero = styled.div`
    width: 100%;
    background-color: #fff;
    border-radius: 16px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    min-height: 400px;
`

export const MovieInfo = styled(FlexColumn)`
    flex: 1;
    padding: 40px;
    gap: 24px;
    justify-content: space-between;
`

export const MovieHeader = styled(FlexColumn)`
    gap: 12px;
`

export const MovieTitle = styled.h1`
    margin: 0;
    font-size: 2.5rem;
    font-weight: 700;
    color: #111827;
    line-height: 1.2;
`

export const MovieMeta = styled(FlexRow)`
    gap: 16px;
    align-items: center;
    flex-wrap: wrap;
`

export const MetaItem = styled.span`
    color: #6b7280;
    font-size: 16px;
    font-weight: 500;
    
    &:not(:last-child)::after {
        content: '•';
        margin-left: 16px;
        color: #d1d5db;
    }
`

export const MovieDescription = styled.p`
    margin: 0;
    color: #374151;
    font-size: 16px;
    line-height: 1.6;
`

export const MovieActions = styled(FlexRow)`
    gap: 16px;
    margin-top: auto;
`

export const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    
    ${props => {
        switch (props.variant) {
            case 'primary':
                return `
                    background-color: #3b82f6;
                    color: white;
                    border: none;
                    
                    &:hover {
                        background-color: #2563eb;
                    }
                `
            case 'danger':
                return `
                    background-color: #ef4444;
                    color: white;
                    border: none;
                    
                    &:hover {
                        background-color: #dc2626;
                    }
                `
            default:
                return `
                    background-color: #f9fafb;
                    color: #374151;
                    border: 1px solid #d1d5db;
                    
                    &:hover {
                        background-color: #f3f4f6;
                        border-color: #9ca3af;
                    }
                `
        }
    }}
    
    svg {
        width: 16px;
        height: 16px;
    }
`

export const FavoriteButton = styled.button<{ isFavorite: boolean }>`
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1px solid ${props => props.isFavorite ? '#f59e0b' : '#d1d5db'};
    background-color: ${props => props.isFavorite ? '#fef3c7' : '#f9fafb'};
    color: ${props => props.isFavorite ? '#d97706' : '#374151'};
    
    &:hover {
        background-color: ${props => props.isFavorite ? '#fde68a' : '#f3f4f6'};
        border-color: ${props => props.isFavorite ? '#d97706' : '#9ca3af'};
    }
    
    svg {
        width: 16px;
        height: 16px;
    }
`

export const BackButton = styled.button`
    position: fixed;
    top: 100px;
    left: 40px;
    padding: 12px;
    background-color: #fff;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    
    &:hover {
        background-color: #f3f4f6;
        border-color: #9ca3af;
    }
    
    svg {
        width: 20px;
        height: 20px;
        color: #374151;
    }
`

export const LoadingContainer = styled(CenterFlexColumn)`
    min-height: 50vh;
    gap: 16px;
`

export const LoadingSpinner = styled.div`
    width: 40px;
    height: 40px;
    border: 4px solid #e5e7eb;
    border-top: 4px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`

export const ErrorContainer = styled(CenterFlexColumn)`
    min-height: 50vh;
    gap: 16px;
    color: #ef4444;
`
