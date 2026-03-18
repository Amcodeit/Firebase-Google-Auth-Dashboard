import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function DashboardPage() {
  const { user, logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await logout()
      navigate('/', { replace: true })
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <section className="w-full max-w-lg rounded-xl bg-white p-8 shadow">
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-3 text-sm text-slate-600">
          You are logged in as <span className="font-medium text-slate-900">{user?.name}</span>
        </p>
        <p className="mt-1 text-sm text-slate-600">{user?.email}</p>

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="mt-6 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-70"
        >
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </section>
    </main>
  )
}

export default DashboardPage