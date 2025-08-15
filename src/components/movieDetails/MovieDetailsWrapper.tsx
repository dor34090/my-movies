import { useParams } from "react-router-dom"
import MovieDetails from "./MovieDetails"

// Wrapper component that extracts the id from URL params
const MovieDetailsWrapper = () => {
    const { id } = useParams<{ id: string }>()
    
    if (!id) {
        return <div>Movie ID not found</div>
    }
    
    return <MovieDetails id={id} />
}

export default MovieDetailsWrapper