import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useEvents } from '../hooks/useEvents'
import EventGrid from '../components/EventGrid'

function DashboardPage() {
  const { user, logout } = useAuth()
  const { searchTerm, setSearchTerm, isFetchingEvents, events, handleSeedData } = useEvents()
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
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        
        {/* Header Section */}
        <header className="mb-8 flex flex-col items-start justify-between rounded-xl bg-white p-6 shadow sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-600">
              Welcome back, <span className="font-medium text-slate-900">{user?.name}</span> ({user?.email})
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-70 sm:mt-0"
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </header>

        {/* Search Bar */}
        <div className="mb-6 flex items-center justify-between">
          <input
            type="text"
            placeholder="Search events by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
          {!isFetchingEvents && events.length === 0 && (
            <button
              onClick={handleSeedData}
              className="ml-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Seed Sample Events
            </button>
          )}
        </div>

        {/* Events Grid */}
        <EventGrid />

      </div>
    </main>
  )
}

export default DashboardPage