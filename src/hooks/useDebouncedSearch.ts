import { useEffect } from 'react'
import { useAppDispatch } from '../store/hooks'
import { searchMoviesAsync, clearSearchAsync } from '../store/moviesSlice'
import { useDebounce } from './useDebounce'

/**
 * Custom hook for debounced search functionality
 * @param searchQuery - The current search query
 * @param delay - The debounce delay in milliseconds (default: 300ms)
 */
export function useDebouncedSearch(searchQuery: string, delay: number = 300) {
  const dispatch = useAppDispatch()
  const debouncedSearchQuery = useDebounce(searchQuery, delay)

  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      // Perform search if there's a query
      dispatch(searchMoviesAsync(debouncedSearchQuery))
    } else {
      // Clear search and load all movies if query is empty
      dispatch(clearSearchAsync())
    }
  }, [debouncedSearchQuery, dispatch])

  return debouncedSearchQuery
}
