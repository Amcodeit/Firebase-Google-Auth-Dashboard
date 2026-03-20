import { useCallback, useEffect, useMemo, useState } from 'react'
import { collection, getDocs, addDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { EventContext } from './event-context'

const LAST_CLICKED_EVENT_KEY = 'intern_last_clicked_event'

const SAMPLE_EVENTS = [
  { name: 'React Workshop', date: '2026-04-10', location: 'New Delhi', description: 'Learn advanced React patterns and best practices.' },
  { name: 'Vue vs React Panel', date: '2026-05-15', location: 'Hyderabad', description: 'Debate on the best frontend framework.' },
  { name: 'Firebase Next Gen', date: '2026-06-20', location: 'Online', description: 'What is new in Firebase and cloud services.' },
  { name: 'CSS Demystified', date: '2026-07-01', location: 'Mumbai', description: 'Deep dive into grid, flexbox, and modern layouts.' },
  { name: 'JavaScript Performance', date: '2026-08-12', location: 'Bhubaneswar', description: 'Optimizing web apps for speed and efficiency.' },
  { name: 'TypeScript Masterclass', date: '2026-09-05', location: 'Chennai', description: 'Advanced generics, decorators, and type utilities.' },
  { name: 'Node.js Scalability Summit', date: '2026-09-22', location: 'Kolkata', description: 'Scaling Node.js backends to millions of users.' },
  { name: 'AI in Frontend', date: '2026-10-10', location: 'Online', description: 'Integrating AI models into web applications.' },
  { name: 'Design Systems Workshop', date: '2026-11-03', location: 'Lucknow', description: 'Building reusable component libraries from scratch.' },
  { name: 'Web Accessibility Bootcamp', date: '2026-12-01', location: 'Chandigarh', description: 'Making the web usable for everyone with WCAG standards.' },
]

export function EventProvider({ children }) {
  const [events, setEvents] = useState([])
  const [isFetchingEvents, setIsFetchingEvents] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [lastClickedId, setLastClickedId] = useState(() => {
    return localStorage.getItem(LAST_CLICKED_EVENT_KEY) || null
  })

  const fetchEvents = useCallback(async () => {
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
  }, [])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const handleCardClick = useCallback((id) => {
    setLastClickedId(id)
    localStorage.setItem(LAST_CLICKED_EVENT_KEY, id)
  }, [])

  const filteredEvents = useMemo(() => {
    if (!searchTerm) return events
    const lowerSearch = searchTerm.toLowerCase()
    return events.filter(event => event.name?.toLowerCase().includes(lowerSearch))
  }, [events, searchTerm])

  const handleSeedData = useCallback(async () => {
    try {
      setIsFetchingEvents(true)
      const eventsRef = collection(db, 'events')
      await Promise.all(SAMPLE_EVENTS.map(evt => addDoc(eventsRef, evt)))
      await fetchEvents()
    } catch (err) {
      console.error('Failed to seed events:', err)
      setIsFetchingEvents(false)
    }
  }, [fetchEvents])

  const value = useMemo(
    () => ({
      events,
      filteredEvents,
      isFetchingEvents,
      searchTerm,
      setSearchTerm,
      lastClickedId,
      handleCardClick,
      handleSeedData,
    }),
    [events, filteredEvents, isFetchingEvents, searchTerm, lastClickedId, handleCardClick, handleSeedData],
  )

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>
}
