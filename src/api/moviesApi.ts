import axiosInstance from './axiosInstance';
import type { Movie } from '../helpers/interfaces';

// API interface for movie operations
export interface MovieApiRequest extends Omit<Movie, 'id'> {
  username: string;
}

export interface EditMovieApiRequest extends Partial<Omit<Movie, 'id'>> {
  username: string;
}

export interface FavoriteApiRequest {
  username: string;
}

// Movies API functions
export const moviesApi = {
  // Get all movies
  getAllMovies: async (): Promise<Movie[]> => {
    const response = await axiosInstance.get('/getAllMovies');
    return response.data;
  },

  // Get movie by ID
  getMovieById: async (id: number): Promise<Movie> => {
    const response = await axiosInstance.get(`/getMovieById/${id}`);
    return response.data;
  },

  // Add new movie
  addMovie: async (movieData: MovieApiRequest): Promise<Movie> => {
    const response = await axiosInstance.post('/addMovie', movieData);
    return response.data;
  },

  // Edit movie
  editMovie: async (id: number, movieData: EditMovieApiRequest): Promise<Movie> => {
    const response = await axiosInstance.put(`/editMovie/${id}`, movieData);
    return response.data;
  },

  // Delete movie
  deleteMovie: async (id: number, username: string): Promise<void> => {
    await axiosInstance.delete(`/deleteMovie/${id}`, {
      data: { username }
    });
  },

  // Get user's favorite movies
  getAllFavourites: async (username: string): Promise<Movie[]> => {
    const response = await axiosInstance.get('/getAllFavourites', {
      params: { username }
    });
    return response.data;
  },

  // Search within user's favorites
  searchFavourites: async (username: string, searchTerm: string): Promise<Movie[]> => {
    const response = await axiosInstance.get('/searchFavourites', {
      params: { username, searchTerm }
    });
    return response.data;
  },

  // Add movie to favorites
  addToFavourites: async (movieId: number, username: string): Promise<void> => {
    await axiosInstance.post(`/addToFavourites/${movieId}`, { username });
  },

  // Remove movie from favorites
  removeFromFavourites: async (movieId: number, username: string): Promise<void> => {
    await axiosInstance.delete(`/removeFromFavourites/${movieId}`, {
      data: { username }
    });
  },

  // Check if movie is favorited
  isMovieFavorited: async (movieId: number, username: string): Promise<boolean> => {
    const response = await axiosInstance.get(`/isMovieFavorited/${movieId}`, {
      params: { username }
    });
    return response.data.isFavorited;
  },

  // Search all movies
  searchMovies: async (searchTerm: string): Promise<Movie[]> => {
    const response = await axiosInstance.get('/searchMovies', {
      params: { searchTerm }
    });
    return response.data;
  },
};
