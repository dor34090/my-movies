import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { 
    MoviesListContainer, 
    MoviesListHeader, 
    MovieList, 
    HeaderTop, 
    HeaderControls, 
    SearchBar, 
    FilterButton,
    AddButton 
} from "../../styles/MoviesList"
import type { Movie } from '../../helpers/interfaces'
import { fetchMovies, fetchFavorites, setSearchQuery, toggleShowFavoritesOnly, selectFilteredMovies, deleteMovieAsync, addToFavoritesAsync, removeFromFavoritesAsync } from '../../store/moviesSlice'
import MovieCard from './MovieCard'
import MovieModal from '../movieModal/MovieModal'
import UserConfirmationModal from '../userConfirmationModal/UserConfirmationModal'

const MoviesList = () => {
    const dispatch = useAppDispatch()
    const { 
        movies, 
        loading, 
        error, 
        searchQuery, 
        showFavoritesOnly,
        currentUsername 
    } = useAppSelector((state) => state.movies)
    
    const filteredMovies = useAppSelector(selectFilteredMovies)

    useEffect(() => {
        dispatch(fetchMovies())
    }, [dispatch])

    // Fetch favorites when username changes
    useEffect(() => {
        if (currentUsername) {
            dispatch(fetchFavorites(currentUsername))
        }
    }, [dispatch, currentUsername])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearchQuery(e.target.value))
    }

    const handleFavoritesToggle = () => {
        if (!currentUsername) {
            setConfirmAction('favorites')
            setIsConfirmModalOpen(true)
            return
        }
        dispatch(toggleShowFavoritesOnly())
    }

    console.log("currentUsername", currentUsername)



    const handleFavoriteRequested = (movieId: number, isFavorite: boolean) => {
        setPendingFavoriteAction({ movieId, isFavorite })
        setConfirmAction('favorites')
        setIsConfirmModalOpen(true)
    }

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingMovie, setEditingMovie] = useState<Movie | null>(null)
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
    const [confirmAction, setConfirmAction] = useState<'delete' | 'favorites' | null>(null)
    const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null)
    const [pendingFavoriteAction, setPendingFavoriteAction] = useState<{ movieId: number; isFavorite: boolean } | null>(null)

    const handleAddMovie = () => {
        setEditingMovie(null)
        setIsModalOpen(true)
    }

    const handleEditMovie = (movie: Movie) => {
        setEditingMovie(movie)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setEditingMovie(null)
    }

    const handleDeleteMovie = (movieId: number) => {
        const movie = filteredMovies.find(m => m.id === movieId)
        if (movie) {
            setMovieToDelete(movie)
            setConfirmAction('delete')
            setIsConfirmModalOpen(true)
        }
    }

    const handleConfirmAction = async (username: string) => {
        if (confirmAction === 'delete' && movieToDelete) {
            try {
                await dispatch(deleteMovieAsync({ id: movieToDelete.id, username })).unwrap()
                setIsConfirmModalOpen(false)
                setMovieToDelete(null)
            } catch (error) {
                console.error('Error deleting movie:', error)
            }
        } else if (confirmAction === 'favorites') {
            // Fetch favorites for the confirmed username
            await dispatch(fetchFavorites(username))
            
            // If there's a pending favorite action, execute it
            if (pendingFavoriteAction) {
                try {
                    const { movieId, isFavorite } = pendingFavoriteAction
                    if (isFavorite) {
                        await dispatch(removeFromFavoritesAsync({ movieId, username })).unwrap()
                    } else {
                        await dispatch(addToFavoritesAsync({ movieId, username })).unwrap()
                    }
                } catch (error) {
                    console.error('Error toggling favorite:', error)
                }
            } else {
                // If no pending action, just toggle the favorites filter
                dispatch(toggleShowFavoritesOnly())
            }
            
            setIsConfirmModalOpen(false)
            setPendingFavoriteAction(null)
        }
        setConfirmAction(null)
    }

    const handleCancelDelete = () => {
        setIsConfirmModalOpen(false)
        setMovieToDelete(null)
        setConfirmAction(null)
    }

    if (loading) {
        return (
            <MoviesListContainer>
                <MoviesListHeader>
                    <h1>Loading Movies...</h1>
                </MoviesListHeader>
            </MoviesListContainer>
        )
    }

    if (error) {
        return (
            <MoviesListContainer>
                <MoviesListHeader>
                    <h1>Error: {error}</h1>
                </MoviesListHeader>
            </MoviesListContainer>
        )
    }

    if(!movies.length) {
        return (
            <MoviesListContainer>
                <MoviesListHeader>
                    <HeaderTop>
                        <h1>No movies available</h1>
                        <HeaderControls>
                            <SearchBar 
                                type="text" 
                                placeholder="Search movies..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                            <FilterButton 
                                active={showFavoritesOnly}
                                onClick={handleFavoritesToggle}
                            >
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    viewBox="0 0 24 24" 
                                    width="16" 
                                    height="16"
                                >
                                    <polygon 
                                        points="12 2 15 8 22 9 17 14 18 21 12 18 6 21 7 14 2 9 9 8 12 2"
                                        fill={showFavoritesOnly ? "#FFD700" : "#f0f0f0"}
                                        stroke={showFavoritesOnly ? "#FFA500" : "#666"}
                                        strokeWidth="2"
                                    />
                                </svg>
                                {showFavoritesOnly ? 'Show All' : 'Favorites Only'}
                            </FilterButton>
                            <AddButton onClick={handleAddMovie}>
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    viewBox="0 0 24 24" 
                                    width="16" 
                                    height="16"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                Add Movie
                            </AddButton>
                        </HeaderControls>
                    </HeaderTop>
                </MoviesListHeader>
            </MoviesListContainer>
        )
    }

    return (
        <MoviesListContainer>
            <MoviesListHeader>
                <HeaderTop>
                    <h1>Movies List ({filteredMovies.length} of {movies.length} movies)</h1>
                    <HeaderControls>
                        <SearchBar 
                            type="text" 
                            name="search"
                            placeholder="Search movies..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <FilterButton 
                            active={showFavoritesOnly}
                            onClick={handleFavoritesToggle}
                            title={showFavoritesOnly ? 'Show all movies' : 'Show only favorite movies'}
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 24 24" 
                                width="16" 
                                height="16"
                            >
                                <polygon 
                                    points="12 2 15 8 22 9 17 14 18 21 12 18 6 21 7 14 2 9 9 8 12 2"
                                    fill={showFavoritesOnly ? "#FFD700" : "#f0f0f0"}
                                    stroke={showFavoritesOnly ? "#FFA500" : "#666"}
                                    strokeWidth="2"
                                />
                            </svg>
                            {showFavoritesOnly ? 'Show All' : 'Favorites Only'}
                        </FilterButton>
                        <AddButton onClick={handleAddMovie}>
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 24 24" 
                                width="16" 
                                height="16"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Add Movie
                        </AddButton>
                    </HeaderControls>
                </HeaderTop>
            </MoviesListHeader>
            <MovieList>
                {filteredMovies.length === 0 ? (
                    <div style={{ textAlign: 'center', width: '100%', padding: '40px' }}>
                        <h3>No movies found</h3>
                        <p>{searchQuery ? `No movies match "${searchQuery}"` : 'No favorite movies selected'}</p>
                    </div>
                ) : (
                    filteredMovies.map((movie: Movie) => (
                        <MovieCard 
                            key={movie.id} 
                            movie={movie} 
                            onEdit={handleEditMovie}
                            onDelete={handleDeleteMovie}
                            onFavoriteRequested={handleFavoriteRequested}
                        />
                    ))
                )}  
            </MovieList>
            <MovieModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                movie={editingMovie}
            />
            <UserConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmAction}
                actionType={confirmAction === 'delete' ? 'delete' : 'create'}
                movieTitle={confirmAction === 'delete' ? movieToDelete?.title : undefined}
                title={confirmAction === 'delete' ? 'Delete Movie' : 'Confirm Username for Favorites'}
            />
        </MoviesListContainer>
    )
}

export default MoviesList
