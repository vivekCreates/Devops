import { Routes, Route, Navigate } from 'react-router-dom'
import WelcomePage from './pages/WelcomePage'
import SignUpPage from './pages/SignUpPage'
import SignInPage from './pages/SignInPage'
import HomePage from './pages/HomePage'
import StreakPage from './pages/StreakPage'
import DashboardPage from './pages/DashboardPage'
import PublicRoute from './routes/PublicRoutes'
import ProtectedRoute from './routes/ProtectedRoutes'
import { useAuthStore } from './store/authStore'
import { useEffect } from 'react'
import { useHabitStore } from './store/habitStore'


function App() {
  const {getCurrentUser,hydrateAuth} = useAuthStore();


  useEffect(() => {
    hydrateAuth();
    getCurrentUser();
  }, [getCurrentUser]);



  return (
    <Routes>
      <Route element={<PublicRoute/>}>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/signin" element={<SignInPage />} />
      </Route>


      <Route element={<ProtectedRoute/>}>
      <Route path="/home" element={<HomePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/streak" element={<StreakPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
