import { Routes, Route, Navigate } from 'react-router-dom'
import WelcomePage from './pages/WelcomePage'
import SignUpPage from './pages/SignUpPage'
import SignInPage from './pages/SignInPage'
import HomePage from './pages/HomePage'
import StreakPage from './pages/StreakPage'
import HabitDetailPage from './pages/HabitDetailPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/streak" element={<StreakPage />} />
      <Route path="/habit" element={<HabitDetailPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
