import { useNavigate } from 'react-router-dom'
import type { Movie } from "../../helpers/interfaces"
import { MovieCardWrapper, MovieCardTitle, MovieCardDetail, MovieCardDetails, MovieCardTop, MovieCardActions, ActionButton, MovieCardInner } from "../../styles/MoviesList"
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { addToFavoritesAsync, removeFromFavoritesAsync } from '../../store/moviesSlice'

interface MovieCardProps {
    movie: Movie
    onEdit?: (movie: Movie) => void
    onDelete?: (movieId: number) => void
    onFavoriteRequested?: (movieId: number, isFavorite: boolean) => void
}

const MovieCard = ({ movie, onEdit, onDelete, onFavoriteRequested }: MovieCardProps) => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { favoriteMovieIds, currentUsername } = useAppSelector((state) => state.movies)
    const isFavorite = favoriteMovieIds.includes(movie.id)

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        
        if (!currentUsername) {
            // Call the callback to handle username confirmation
            onFavoriteRequested?.(movie.id, isFavorite)
            return
        }

        try {
            if (isFavorite) {
                await dispatch(removeFromFavoritesAsync({ movieId: movie.id, username: currentUsername })).unwrap()
            } else {
                await dispatch(addToFavoritesAsync({ movieId: movie.id, username: currentUsername })).unwrap()
            }
        } catch (error) {
            console.error('Error toggling favorite:', error)
        }
    }

    const handleEdit = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        onEdit?.(movie)
    }

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        onDelete?.(movie.id)
    }

    const handleCardClick = () => {
        navigate(`/movie/${movie.id}`)
    }

    return (
       <MovieCardWrapper key={movie.id} onClick={handleCardClick}>
        <MovieCardInner>
           <MovieCardTop>
           <MovieCardTitle>{movie.title}</MovieCardTitle>
           <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                width="24" 
                height="24"
                style={{ cursor: "pointer" }}
                onClick={toggleFavorite}
            >
                <polygon 
                    points="12 2 15 8 22 9 17 14 18 21 12 18 6 21 7 14 2 9 9 8 12 2"
                    fill={isFavorite ? "#FFD700" : "#f0f0f0"}
                    stroke={isFavorite ? "#FFA500" : "#666"}
                    strokeWidth="2"
                />
            </svg>
           </MovieCardTop>
           <MovieCardDetails>
               <MovieCardDetail>{movie.year} • {movie.genre}</MovieCardDetail>
               <MovieCardDetail>Dir: {movie.director}</MovieCardDetail>
           </MovieCardDetails>
           </MovieCardInner>
           <MovieCardActions>
                <ActionButton onClick={handleEdit}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m18 2 4 4-14 14H4v-4L18 2z"/>
                    </svg>
                    Edit
                </ActionButton>
                <ActionButton variant="delete" onClick={handleDelete}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3,6 5,6 21,6"/>
                        <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"/>
                    </svg>
                    Delete
                </ActionButton>
            </MovieCardActions>
        </MovieCardWrapper>
    )
}

export default MovieCard