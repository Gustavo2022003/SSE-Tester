import type { Theme, EventMessage, CustomFilter } from '../types'
import { getColorForType } from '../utils/eventUtils'

interface EventsListProps {
    theme: Theme
    connected: boolean
    filteredEvents: EventMessage[]
    customFilters: CustomFilter[]
    copiedId: string | null
    onCopyToClipboard: (text: string, eventId: string) => void
}

export const EventsList = ({ 
    theme, 
    connected, 
    filteredEvents, 
    customFilters,
    copiedId,
    onCopyToClipboard 
}: EventsListProps) => {
    return (
        <div className={`rounded-lg shadow-xl border overflow-hidden transition-colors ${
            theme === 'dark'
                ? 'bg-slate-800 border-slate-700'
                : 'bg-white border-slate-200'
        }`}>
            <div className={`px-6 py-4 border-b ${
                theme === 'dark'
                    ? 'bg-slate-700 border-slate-600'
                    : 'bg-slate-100 border-slate-200'
            }`}>
                <h2 className={`text-lg font-semibold ${
                    theme === 'dark'
                        ? 'text-white'
                        : 'text-slate-900'
                }`}>
                    Received Events
                </h2>
            </div>

            {filteredEvents.length === 0 ? (
                <div className="px-6 py-12 text-center">
                    <p className={`text-sm ${
                        theme === 'dark'
                            ? 'text-slate-400'
                            : 'text-slate-500'
                    }`}>
                        {connected
                            ? customFilters.some(f => f.activeValues.size > 0)
                                ? 'No events found with the selected filters'
                                : 'Waiting for events...'
                            : 'No events received. Connect to an SSE endpoint to start.'}
                    </p>
                </div>
            ) : (
                <div className="max-h-[600px] overflow-y-auto">
                    {filteredEvents.map((event, index) => (
                        <div
                            key={event.id}
                            className={`px-6 py-4 border-b transition-colors ${
                                theme === 'dark'
                                    ? `border-slate-700 hover:bg-slate-700/50 ${index === 0 ? 'bg-slate-700/30' : ''}`
                                    : `border-slate-200 hover:bg-slate-50 ${index === 0 ? 'bg-slate-100' : ''}`
                            }`}
                        >
                            <div className="flex items-center justify-between gap-4 mb-2 flex-wrap">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`inline-block text-xs font-mono px-2 py-1 rounded ${
                                        theme === 'dark'
                                            ? 'bg-blue-900 text-blue-300'
                                            : 'bg-blue-100 text-blue-700'
                                    }`}>
                                        {event.id}
                                    </span>
                                    <span className={`text-xs ${
                                        theme === 'dark'
                                            ? 'text-slate-400'
                                            : 'text-slate-500'
                                    }`}>
                                        {event.timestamp}
                                    </span>
                                    {event.parsedType && (
                                        <span className={`text-xs px-2 py-1 rounded font-semibold text-white ${getColorForType(event.parsedType)}`}>
                                            {event.parsedType}
                                        </span>
                                    )}
                                    <span className={`text-xs px-2 py-1 rounded ${
                                        theme === 'dark'
                                            ? 'bg-slate-700 text-slate-300'
                                            : 'bg-slate-200 text-slate-600'
                                    }`}>
                                        {event.type}
                                    </span>
                                </div>
                                <button
                                    onClick={() => onCopyToClipboard(event.data, event.id)}
                                    className={`px-3 py-1 text-xs rounded transition-colors whitespace-nowrap ${
                                        copiedId === event.id
                                            ? 'bg-green-600 text-white'
                                            : theme === 'dark'
                                            ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                                            : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                                    }`}
                                >
                                    {copiedId === event.id ? '✓ Copied!' : '📋 Copy'}
                                </button>
                            </div>

                            <div className={`rounded p-3 text-sm font-mono overflow-x-auto ${
                                theme === 'dark'
                                    ? 'bg-slate-900 text-slate-300'
                                    : 'bg-slate-100 text-slate-700'
                            }`}>
                                <pre className="whitespace-pre-wrap break-words text-xs">
                                    {event.data.length > 500
                                        ? event.data.substring(0, 500) + '...'
                                        : event.data}
                                </pre>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
