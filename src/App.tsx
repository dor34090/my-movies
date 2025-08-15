import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'
import MoviesList from './components/moviesList/MoviesList'
import './App.css'
import MovieDetailsWrapper from './components/movieDetails/MovieDetailsWrapper'

function AppContent() {


  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MoviesList />} />
          <Route path="/movie/:id" element={<MovieDetailsWrapper />} />
        </Routes>
      </div>
    </Router>
  )
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}

export default App
