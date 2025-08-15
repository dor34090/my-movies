import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { moviesApi } from '../moviesApi'

// Mock the axios instance
vi.mock('../axiosInstance', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

import axiosInstance from '../axiosInstance'
const mockAxiosInstance = axiosInstance as any

describe('moviesApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getAllMovies', () => {
    it('should fetch movies successfully', async () => {
      const mockMovies = [
        { id: 1, title: 'Movie 1', year: '2023', genre: 'Action', director: 'Director 1', runtime: '120' },
        { id: 2, title: 'Movie 2', year: '2022', genre: 'Comedy', director: 'Director 2', runtime: '90' }
      ]

      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockMovies })

      const result = await moviesApi.getAllMovies()

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/getAllMovies')
      expect(result).toEqual(mockMovies)
    })

    it('should handle fetch movies error', async () => {
      const errorMessage = 'Network Error'
      mockAxiosInstance.get.mockRejectedValueOnce(new Error(errorMessage))

      await expect(moviesApi.getAllMovies()).rejects.toThrow(errorMessage)
    })
  })

  describe('getMovieById', () => {
    it('should fetch movie by id successfully', async () => {
      const mockMovie = { id: 1, title: 'Movie 1', year: '2023', genre: 'Action', director: 'Director 1', runtime: '120' }

      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockMovie })

      const result = await moviesApi.getMovieById(1)

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/getMovieById/1')
      expect(result).toEqual(mockMovie)
    })

    it('should handle fetch movie by id error', async () => {
      const errorMessage = 'Network Error'
      mockAxiosInstance.get.mockRejectedValueOnce(new Error(errorMessage))

      await expect(moviesApi.getMovieById(1)).rejects.toThrow(errorMessage)
    })
  })

  describe('addMovie', () => {
    it('should add movie successfully', async () => {
      const movieData = {
        title: 'New Movie',
        year: '2023',
        genre: 'Action',
        director: 'Director',
        runtime: '120',
        username: 'testuser'
      }
      const mockResponse = { id: 1, ...movieData }

      mockAxiosInstance.post.mockResolvedValueOnce({ data: mockResponse })

      const result = await moviesApi.addMovie(movieData)

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/addMovie', movieData)
      expect(result).toEqual(mockResponse)
    })

    it('should handle add movie error', async () => {
      const movieData = {
        title: 'New Movie',
        year: '2023',
        genre: 'Action',
        director: 'Director',
        runtime: '120',
        username: 'testuser'
      }
      const errorMessage = 'Network Error'
      mockAxiosInstance.post.mockRejectedValueOnce(new Error(errorMessage))

      await expect(moviesApi.addMovie(movieData)).rejects.toThrow(errorMessage)
    })
  })

  describe('editMovie', () => {
    it('should edit movie successfully', async () => {
      const movieData = {
        title: 'Updated Movie',
        username: 'testuser'
      }
      const mockResponse = { id: 1, title: 'Updated Movie', year: '2023', genre: 'Action', director: 'Director', runtime: '120' }

      mockAxiosInstance.put.mockResolvedValueOnce({ data: mockResponse })

      const result = await moviesApi.editMovie(1, movieData)

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/editMovie/1', movieData)
      expect(result).toEqual(mockResponse)
    })

    it('should handle edit movie error', async () => {
      const movieData = {
        title: 'Updated Movie',
        username: 'testuser'
      }
      const errorMessage = 'Network Error'
      mockAxiosInstance.put.mockRejectedValueOnce(new Error(errorMessage))

      await expect(moviesApi.editMovie(1, movieData)).rejects.toThrow(errorMessage)
    })
  })

  describe('deleteMovie', () => {
    it('should delete movie successfully', async () => {
      mockAxiosInstance.delete.mockResolvedValueOnce({})

      await moviesApi.deleteMovie(1, 'testuser')

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/deleteMovie/1', {
        data: { username: 'testuser' }
      })
    })

    it('should handle delete movie error', async () => {
      const errorMessage = 'Network Error'
      mockAxiosInstance.delete.mockRejectedValueOnce(new Error(errorMessage))

      await expect(moviesApi.deleteMovie(1, 'testuser')).rejects.toThrow(errorMessage)
    })
  })

  describe('getAllFavourites', () => {
    it('should fetch favourites successfully', async () => {
      const mockFavourites = [
        { id: 1, title: 'Movie 1', year: '2023', genre: 'Action', director: 'Director 1', runtime: '120' }
      ]

      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockFavourites })

      const result = await moviesApi.getAllFavourites('testuser')

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/getAllFavourites', {
        params: { username: 'testuser' }
      })
      expect(result).toEqual(mockFavourites)
    })
  })

  describe('addToFavourites', () => {
    it('should add to favourites successfully', async () => {
      mockAxiosInstance.post.mockResolvedValueOnce({})

      await moviesApi.addToFavourites(1, 'testuser')

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/addToFavourites/1', { username: 'testuser' })
    })
  })

  describe('removeFromFavourites', () => {
    it('should remove from favourites successfully', async () => {
      mockAxiosInstance.delete.mockResolvedValueOnce({})

      await moviesApi.removeFromFavourites(1, 'testuser')

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/removeFromFavourites/1', {
        data: { username: 'testuser' }
      })
    })
  })

  describe('searchFavourites', () => {
    it('should search favourites successfully', async () => {
      const mockResults = [
        { id: 1, title: 'Movie 1', year: '2023', genre: 'Action', director: 'Director 1', runtime: '120' }
      ]

      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockResults })

      const result = await moviesApi.searchFavourites('testuser', 'Movie')

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/searchFavourites', {
        params: { username: 'testuser', searchTerm: 'Movie' }
      })
      expect(result).toEqual(mockResults)
    })
  })

  describe('isMovieFavorited', () => {
    it('should check if movie is favorited successfully', async () => {
      const mockResponse = { isFavorited: true }

      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockResponse })

      const result = await moviesApi.isMovieFavorited(1, 'testuser')

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/isMovieFavorited/1', {
        params: { username: 'testuser' }
      })
      expect(result).toBe(true)
    })
  })

  describe('searchMovies', () => {
    it('should search movies successfully', async () => {
      const mockResults = [
        { id: 1, title: 'Movie 1', year: '2023', genre: 'Action', director: 'Director 1', runtime: '120' }
      ]

      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockResults })

      const result = await moviesApi.searchMovies('Movie')

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/searchMovies', {
        params: { searchTerm: 'Movie' }
      })
      expect(result).toEqual(mockResults)
    })
  })
})
