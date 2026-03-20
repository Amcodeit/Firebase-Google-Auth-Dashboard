import { useEvents } from '../hooks/useEvents'

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl bg-white p-6 shadow-sm border border-slate-100">
      {/* Title */}
      <div className="h-5 w-3/4 rounded bg-slate-200"></div>
      {/* Date */}
      <div className="mt-4 flex items-center gap-2">
        <div className="h-4 w-12 rounded bg-slate-200"></div>
        <div className="h-4 w-24 rounded bg-slate-200"></div>
      </div>
      {/* Location */}
      <div className="mt-2 flex items-center gap-2">
        <div className="h-4 w-16 rounded bg-slate-200"></div>
        <div className="h-4 w-20 rounded bg-slate-200"></div>
      </div>
      {/* Description */}
      <div className="mt-6 space-y-2">
        <div className="h-3 w-full rounded bg-slate-200"></div>
        <div className="h-3 w-5/6 rounded bg-slate-200"></div>
      </div>
    </div>
  )
}

function EventCard({ event, isHighlighted, onClick }) {
  return (
    <div
      onClick={onClick}
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
  )
}

function EventGrid() {
  const { filteredEvents, isFetchingEvents, events, lastClickedId, handleCardClick } = useEvents()

  if (isFetchingEvents) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((skel) => (
          <SkeletonCard key={skel} />
        ))}
      </div>
    )
  }

  if (filteredEvents.length > 0) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map(event => (
          <EventCard
            key={event.id}
            event={event}
            isHighlighted={lastClickedId === event.id}
            onClick={() => handleCardClick(event.id)}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white py-12 text-center text-slate-500">
      {events.length === 0 ? 'No events found.' : 'No events match your search.'}
    </div>
  )
}

export default EventGrid
