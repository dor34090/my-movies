import { useState, useEffect } from 'react'
import { useAppDispatch } from '../../store/hooks'
import { addMovieAsync, editMovieAsync } from '../../store/moviesSlice'
import type { Movie } from '../../helpers/interfaces'
import UserConfirmationModal from '../userConfirmationModal/UserConfirmationModal'
import {
    ModalOverlay,
    ModalContainer,
    ModalHeader,
    ModalTitle,
    CloseButton,
    ModalBody,
    FormGroup,
    FormLabel,
    FormInput,
    ModalFooter,
    SaveButton,
    CancelButton,
    ErrorMessage
} from '../../styles/MovieModal.ts'

interface MovieModalProps {
    isOpen: boolean
    onClose: () => void
    movie?: Movie | null
}

interface FormData {
    title: string
    year: string
    runtime: string
    genre: string
    director: string
    description?: string
}

interface FormErrors {
    title?: string
    year?: string
    runtime?: string
    genre?: string
    director?: string
}

const MovieModal = ({ isOpen, onClose, movie }: MovieModalProps) => {
    const dispatch = useAppDispatch()
    const isEditMode = !!movie

    const [formData, setFormData] = useState<FormData>({
        title: '',
        year: '',
        runtime: '',
        genre: '',
        director: '',
        description: ''
    })

    const [errors, setErrors] = useState<FormErrors>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showUserConfirmation, setShowUserConfirmation] = useState(false)
    const [pendingMovieData, setPendingMovieData] = useState<any>(null)

    // Reset form when modal opens/closes or movie changes
    useEffect(() => {
        if (isOpen) {
            if (movie) {
                setFormData({
                    title: movie.title,
                    year: movie.year,
                    runtime: movie.runtime,
                    genre: movie.genre,
                    director: movie.director,
                })
            } else {
                setFormData({
                    title: '',
                    year: '',
                    runtime: '',
                    genre: '',
                    director: '',
                })
            }
            setErrors({})
        }
    }, [isOpen, movie])

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required'
        }

        if (!formData.year.trim()) {
            newErrors.year = 'Year is required'
        } else if (!/^\d{4}$/.test(formData.year)) {
            newErrors.year = 'Year must be a 4-digit number'
        }

        if (!formData.runtime.trim()) {
            newErrors.runtime = 'Runtime is required'
        }

        if (!formData.genre.trim()) {
            newErrors.genre = 'Genre is required'
        }

        if (!formData.director.trim()) {
            newErrors.director = 'Director is required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Clear error for this field when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }))
        }
    }



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!validateForm()) {
            return
        }

        // Prepare movie data and show user confirmation modal
        const movieData = {
            title: formData.title.trim(),
            year: formData.year.trim(),
            runtime: formData.runtime.trim(),
            genre: formData.genre.trim(),
            director: formData.director.trim()
        }
        
        setPendingMovieData(movieData)
        setShowUserConfirmation(true)
    }

    const handleConfirmedSubmit = async (username: string) => {
        if (!pendingMovieData) return

        setIsSubmitting(true)

        try {
            const movieDataWithUsername = {
                ...pendingMovieData,
                username
            }

            if (isEditMode && movie) {
                await dispatch(editMovieAsync({ id: movie.id, movieData: movieDataWithUsername })).unwrap()
            } else {
                await dispatch(addMovieAsync(movieDataWithUsername)).unwrap()
            }

            onClose()
        } catch (error) {
            console.error('Error saving movie:', error)
        } finally {
            setIsSubmitting(false)
            setPendingMovieData(null)
        }
    }

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    const handleCloseUserConfirmation = () => {
        setShowUserConfirmation(false)
        setPendingMovieData(null)
    }

    if (!isOpen) return null

    return (
        <ModalOverlay onClick={handleOverlayClick}>
            <ModalContainer>
                <ModalHeader>
                    <ModalTitle>
                        {isEditMode ? 'Edit Movie' : 'Add New Movie'}
                    </ModalTitle>
                    <CloseButton onClick={onClose}>×</CloseButton>
                </ModalHeader>

                <form onSubmit={handleSubmit}>
                    <ModalBody>
                        <FormGroup>
                            <FormLabel htmlFor="title">Title *</FormLabel>
                            <FormInput
                                id="title"
                                name="title"
                                type="text"
                                value={formData.title}
                                onChange={handleInputChange}
                                hasError={!!errors.title}
                            />
                            {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
                        </FormGroup>

                        <FormGroup>
                            <FormLabel htmlFor="year">Year *</FormLabel>
                            <FormInput
                                id="year"
                                name="year"
                                type="text"
                                placeholder="e.g. 2023"
                                value={formData.year}
                                onChange={handleInputChange}
                                hasError={!!errors.year}
                            />
                            {errors.year && <ErrorMessage>{errors.year}</ErrorMessage>}
                        </FormGroup>

                        <FormGroup>
                            <FormLabel htmlFor="runtime">Runtime *</FormLabel>
                            <FormInput
                                id="runtime"
                                name="runtime"
                                type="text"
                                placeholder="e.g. 120 min"
                                value={formData.runtime}
                                onChange={handleInputChange}
                                hasError={!!errors.runtime}
                            />
                            {errors.runtime && <ErrorMessage>{errors.runtime}</ErrorMessage>}
                        </FormGroup>

                        <FormGroup>
                            <FormLabel htmlFor="genre">Genre *</FormLabel>
                            <FormInput
                                id="genre"
                                name="genre"
                                type="text"
                                placeholder="e.g. Action, Drama"
                                value={formData.genre}
                                onChange={handleInputChange}
                                hasError={!!errors.genre}
                            />
                            {errors.genre && <ErrorMessage>{errors.genre}</ErrorMessage>}
                        </FormGroup>

                        <FormGroup>
                            <FormLabel htmlFor="director">Director *</FormLabel>
                            <FormInput
                                id="director"
                                name="director"
                                type="text"
                                value={formData.director}
                                onChange={handleInputChange}
                                hasError={!!errors.director}
                            />
                            {errors.director && <ErrorMessage>{errors.director}</ErrorMessage>}
                        </FormGroup>

                       
                    </ModalBody>

                    <ModalFooter>
                        <CancelButton type="button" onClick={onClose}>
                            Cancel
                        </CancelButton>
                        <SaveButton type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Movie' : 'Add Movie')}
                        </SaveButton>
                    </ModalFooter>
                </form>
            </ModalContainer>
            
            <UserConfirmationModal
                isOpen={showUserConfirmation}
                onClose={handleCloseUserConfirmation}
                onConfirm={handleConfirmedSubmit}
                actionType={isEditMode ? 'update' : 'create'}
                movieTitle={formData.title || 'this movie'}
            />
        </ModalOverlay>
    )
}

export default MovieModal
