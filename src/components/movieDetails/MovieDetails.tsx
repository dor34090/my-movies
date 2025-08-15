import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchMovieById, addToFavoritesAsync, removeFromFavoritesAsync, deleteMovieAsync } from '../../store/moviesSlice'
import MovieModal from '../movieModal/MovieModal'
import ConfirmationModal from '../confirmationModal/ConfirmationModal'
import {
    MovieDetailsContainer,
    MovieDetailsContent,
    MovieHero,
    MovieInfo,
    MovieHeader,
    MovieTitle,
    MovieMeta,
    MetaItem,
    MovieActions,
    ActionButton,
    FavoriteButton,
    BackButton,
    LoadingContainer,
    LoadingSpinner,
    ErrorContainer
} from '../../styles/MovieDetails'

interface MovieDetailsProps {
    id: string
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ id }) => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { selectedMovie, loading, error, favoriteMovieIds, currentUsername } = useAppSelector((state) => state.movies)
    
    // Modal states
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    
    const isFavorite = selectedMovie ? favoriteMovieIds.includes(selectedMovie.id) : false
    
    useEffect(() => {
        dispatch(fetchMovieById(Number(id)))
    }, [dispatch, id])
    
    const handleBack = () => {
        navigate('/')
    }
    
    const handleToggleFavorite = async () => {
        if (selectedMovie && currentUsername) {
            try {
                if (isFavorite) {
                    await dispatch(removeFromFavoritesAsync({ movieId: selectedMovie.id, username: currentUsername })).unwrap()
                } else {
                    await dispatch(addToFavoritesAsync({ movieId: selectedMovie.id, username: currentUsername })).unwrap()
                }
            } catch (error) {
                console.error('Error toggling favorite:', error)
            }
        }
    }
    
    const handleEdit = () => {
        setIsEditModalOpen(true)
    }
    
    const handleDelete = () => {
        setIsDeleteModalOpen(true)
    }
    
    const handleConfirmDelete = async () => {
        if (selectedMovie && currentUsername) {
            try {
                await dispatch(deleteMovieAsync({ id: selectedMovie.id, username: currentUsername })).unwrap()
                navigate('/')
            } catch (error) {
                console.error('Error deleting movie:', error)
            }
        }
        setIsDeleteModalOpen(false)
    }
    
    const handleCloseEditModal = () => {
        setIsEditModalOpen(false)
    }
    
    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false)
    }
    
    if (loading) {
        return (
            <MovieDetailsContainer>
                <BackButton onClick={handleBack}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m15 18-6-6 6-6"/>
                    </svg>
                </BackButton>
                <LoadingContainer>
                    <LoadingSpinner />
                    <p>Loading movie details...</p>
                </LoadingContainer>
            </MovieDetailsContainer>
        )
    }
    
    if (error) {
        return (
            <MovieDetailsContainer>
                <BackButton onClick={handleBack}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m15 18-6-6 6-6"/>
                    </svg>
                </BackButton>
                <ErrorContainer>
                    <h2>Error Loading Movie</h2>
                    <p>{error}</p>
                    <ActionButton onClick={handleBack}>
                        Go Back
                    </ActionButton>
                </ErrorContainer>
            </MovieDetailsContainer>
        )
    }
    
    if (!selectedMovie) {
        return (
            <MovieDetailsContainer>
                <BackButton onClick={handleBack}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m15 18-6-6 6-6"/>
                    </svg>
                </BackButton>
                <ErrorContainer>
                    <h2>Movie Not Found</h2>
                    <p>The requested movie could not be found.</p>
                    <ActionButton onClick={handleBack}>
                        Go Back
                    </ActionButton>
                </ErrorContainer>
            </MovieDetailsContainer>
        )
    }
    
    return (
        <MovieDetailsContainer>
            <BackButton onClick={handleBack}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m15 18-6-6 6-6"/>
                </svg>
            </BackButton>
            
            <MovieDetailsContent>
                <MovieHero>
                    <MovieInfo>
                        <MovieHeader>
                            <MovieTitle>{selectedMovie.title}</MovieTitle>
                            <MovieMeta>
                                <MetaItem>{selectedMovie.year}</MetaItem>
                                <MetaItem>{selectedMovie.genre}</MetaItem>
                                <MetaItem>{selectedMovie.runtime}</MetaItem>
                            </MovieMeta>
                            <MovieMeta>
                                <MetaItem>Directed by {selectedMovie.director}</MetaItem>
                            </MovieMeta>
                        </MovieHeader>
                        
                        
                        
                        <MovieActions>
                            <FavoriteButton 
                                isFavorite={isFavorite}
                                onClick={handleToggleFavorite}
                            >
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    viewBox="0 0 24 24" 
                                    fill={isFavorite ? "currentColor" : "none"}
                                    stroke="currentColor" 
                                    strokeWidth="2"
                                >
                                    <polygon points="12 2 15 8 22 9 17 14 18 21 12 18 6 21 7 14 2 9 9 8 12 2"/>
                                </svg>
                                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                            </FavoriteButton>
                            
                            <ActionButton onClick={handleEdit}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="m18 2 4 4-14 14H4v-4L18 2z"/>
                                </svg>
                                Edit Movie
                            </ActionButton>
                            
                            <ActionButton variant="danger" onClick={handleDelete}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="3,6 5,6 21,6"/>
                                    <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"/>
                                </svg>
                                Delete Movie
                            </ActionButton>
                        </MovieActions>
                    </MovieInfo>
                </MovieHero>
            </MovieDetailsContent>
            
            <MovieModal 
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                movie={selectedMovie}
            />
            
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                title="Delete Movie"
                message={`Are you sure you want to delete "${selectedMovie.title}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
            />
        </MovieDetailsContainer>
    )
}

export default MovieDetails
