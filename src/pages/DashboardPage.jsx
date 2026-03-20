import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, addDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../hooks/useAuth'

const LAST_CLICKED_EVENT_KEY = 'intern_last_clicked_event'

function DashboardPage() {
  const { user, logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const navigate = useNavigate()

  const [events, setEvents] = useState([])
  const [isFetchingEvents, setIsFetchingEvents] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [lastClickedId, setLastClickedId] = useState(() => {
    return localStorage.getItem(LAST_CLICKED_EVENT_KEY) || null
  })

  // Function to fetch events from Firestore
  const fetchEvents = async () => {
    try {
      setIsFetchingEvents(true)
      const querySnapshot = await getDocs(collection(db, 'events'))
      const eventsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setEvents(eventsData)
    } catch (err) {
      console.error('Error fetching events:', err)
    } finally {
      setIsFetchingEvents(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await logout()
      navigate('/', { replace: true })
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleCardClick = (id) => {
    setLastClickedId(id)
    localStorage.setItem(LAST_CLICKED_EVENT_KEY, id)
  }

  // Filter events based on search term in real-time
  const filteredEvents = useMemo(() => {
    if (!searchTerm) return events
    const lowerSearch = searchTerm.toLowerCase()
    return events.filter(event => event.name?.toLowerCase().includes(lowerSearch))
  }, [events, searchTerm])

  // Utility to seed some data manually if empty (Task 2 helper)
  const handleSeedData = async () => {
    const sampleEvents = [
      { name: 'React Workshop', date: '2026-04-10', location: 'New York', description: 'Learn advanced React patterns.' },
      { name: 'Vue vs React Panel', date: '2026-05-15', location: 'San Francisco', description: 'Debate on the best framework.' },
      { name: 'Firebase Next Gen', date: '2026-06-20', location: 'Online', description: 'What is new in Firebase.' },
      { name: 'CSS Demystified', date: '2026-07-01', location: 'London', description: 'Deep dive into grid and flexbox.' },
      { name: 'JavaScript Performance', date: '2026-08-12', location: 'Berlin', description: 'Optimizing web apps.' }
    ]
    try {
      setIsFetchingEvents(true)
      const eventsRef = collection(db, 'events')
      await Promise.all(sampleEvents.map(evt => addDoc(eventsRef, evt)))
      await fetchEvents()
    } catch (err) {
      console.error('Failed to seed events:', err)
      setIsFetchingEvents(false)
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
        {isFetchingEvents ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Loading Skeletons */}
            {[1, 2, 3, 4, 5, 6].map((skel) => (
              <div key={skel} className="animate-pulse rounded-xl bg-white p-6 shadow-sm border border-slate-100">
                <div className="h-5 w-3/4 rounded bg-slate-200"></div>
                <div className="mt-4 h-4 w-1/2 rounded bg-slate-200"></div>
                <div className="mt-2 h-4 w-1/3 rounded bg-slate-200"></div>
                <div className="mt-6 h-16 w-full rounded bg-slate-200"></div>
              </div>
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map(event => {
              const isHighlighted = lastClickedId === event.id;
              return (
                <div
                  key={event.id}
                  onClick={() => handleCardClick(event.id)}
                  className={`cursor-pointer rounded-xl border p-6 transition-all duration-200 ${
                    isHighlighted
                      ? 'border-indigo-500 bg-indigo-50 shadow-md ring-1 ring-indigo-500'
                      : 'border-slate-200 bg-white shadow-sm hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  <h3 className="text-lg font-semibold text-slate-900">{event.name}</h3>
                  <div className="mt-2 flex items-center text-sm text-slate-600">
                    <span className="font-medium mr-2">Date:</span> {event.date || 'TBD'}
                  </div>
                  <div className="mt-1 flex items-center text-sm text-slate-600">
                    <span className="font-medium mr-2">Location:</span> {event.location || 'TBD'}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-700">
                    {event.description}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white py-12 text-center text-slate-500">
            {events.length === 0 ? 'No events found.' : 'No events match your search.'}
          </div>
        )}

      </div>
    </main>
  )
}

export default DashboardPage