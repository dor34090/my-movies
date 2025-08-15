import styled from "styled-components";
import { CenterFlexColumn, FlexColumn, FlexRow } from "./Globals";


export const MoviesListContainer = styled.div`
    padding: 80px 0;
    min-height: 100vh;
    width: 100vw;
    background-color: #f4f4f4;
    color: #333;
`

export const MoviesListHeader = styled(CenterFlexColumn)`
    width: 100%;
    padding: 20px 0;
    background-color: #f5f5f5;
    gap: 20px;
`

export const HeaderTop = styled(FlexRow)`
    width: 100%;
    max-width: 1200px;
    padding: 0 100px;
    justify-content: space-between;
    align-items: center;
`

export const HeaderControls = styled(FlexRow)`
    gap: 20px;
    align-items: center;
`

export const SearchBar = styled.input`
    padding: 12px 16px;
    background-color: #fff;
    border: 2px solid #ddd;
    color: #333;
    border-radius: 8px;
    font-size: 16px;
    width: 300px;
    transition: border-color 0.2s ease;
    
    &:focus {
        outline: none;
        border-color: #333;
    }
    
    &::placeholder {
        color: #999;
    }
`

export const FilterButton = styled.button<{ active: boolean }>`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    border: 2px solid ${props => props.active ? '#f59e0b' : '#ddd'};
    border-radius: 8px;
    background-color: ${props => props.active ? '#fef3c7' : '#fff'};
    color: ${props => props.active ? '#92400e' : '#666'};
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        border-color: #f59e0b;
        background-color: #fef3c7;
        color: #92400e;
    }
    
    svg {
        width: 16px;
        height: 16px;
    }
`

export const AddButton = styled.button`
    padding: 12px 16px;
    border: 2px solid #3b82f6;
    border-radius: 8px;
    background-color: #3b82f6;
    color: white;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
    
    &:hover {
        background-color: #2563eb;
        border-color: #2563eb;
    }
    
    svg {
        width: 16px;
        height: 16px;
    }
`

export const MovieList = styled(FlexRow)`
    padding: 0 100px;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
`

export const MovieCardWrapper = styled.a`
color: inherit;
display: flex;
flex-direction: column;
align-items: baseline;
justify-content: space-between;
width: 500px;
height: 250px;
background-color: #fff;
    border-radius: 10px;
    border: 1px solid #333;
    overflow: hidden;
    transition: transform 0.2s ease-in-out;
    cursor: pointer;
    padding: 16px;
    padding-top: 30px;
    &:hover {
        transform: scale(1.05);
        color: inherit;
    }
`

export const MovieCardInner = styled(FlexColumn)`
    height: 100%;
    width: 100%;
    justify-content: space-between;
`

export const MovieCardTop = styled(FlexRow)`
width: 100%;
align-items: flex-start;
justify-content: space-between;
`

export const MovieCardTitle = styled.h2`
    font-size: 30px;
    font-weight: 500;
    margin: 0;
    line-height: 1;
`

export const MovieCardDetails = styled(FlexColumn)`
    gap: 10px;
`

export const MovieCardDetail = styled.p`
    font-size: 14px;
    color: #666;
    margin: 0;
`

export const MovieCardActions = styled.div`
    display: flex;
    gap: 8px;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #e5e7eb;
`

export const ActionButton = styled.button<{ variant?: 'edit' | 'delete' }>`
    padding: 6px 12px;
    border: 1px solid ${props => props.variant === 'delete' ? '#ef4444' : '#3b82f6'};
    border-radius: 6px;
    background-color: ${props => props.variant === 'delete' ? '#fef2f2' : '#eff6ff'};
    color: ${props => props.variant === 'delete' ? '#dc2626' : '#2563eb'};
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: all 0.2s ease;
    
    &:hover {
        background-color: ${props => props.variant === 'delete' ? '#fee2e2' : '#dbeafe'};
        border-color: ${props => props.variant === 'delete' ? '#dc2626' : '#2563eb'};
    }
    
    svg {
        width: 12px;
        height: 12px;
    }
`