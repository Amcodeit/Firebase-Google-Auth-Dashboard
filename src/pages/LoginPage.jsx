import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function LoginPage() {
  const { isAuthenticated, isLoading, loginWithGoogle, firebaseConfigError } = useAuth()
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/dashboard'

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-700">
        Restoring session...
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleGoogleLogin = async () => {
    try {
      setError('')
      setIsSubmitting(true)
      await loginWithGoogle()
      navigate(from, { replace: true })
    } catch (authError) {
      setError(authError.message || 'Login failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <section className="w-full max-w-md rounded-xl bg-white p-8 shadow">
        <h1 className="text-2xl font-semibold text-slate-900">Login</h1>
        <p className="mt-2 text-sm text-slate-600">Sign in with Google to access your dashboard.</p>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isSubmitting || Boolean(firebaseConfigError)}
          className="mt-6 w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-70"
        >
          {isSubmitting ? 'Signing in...' : 'Continue with Google'}
        </button>

        {firebaseConfigError && <p className="mt-3 text-sm text-red-600">{firebaseConfigError}</p>}
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </section>
    </main>
  )
}

export default LoginPage