import { useState, useRef, useEffect } from 'react'
import type { EventMessage } from './types'
import { useTheme } from './hooks/useTheme'
import { useProfiles } from './hooks/useProfiles'
import { useCustomFilters } from './hooks/useCustomFilters'
import { Header } from './components/Header'
import { ProfileTabs } from './components/ProfileTabs'
import { Instructions } from './components/Instructions'
import { ConnectionPanel } from './components/ConnectionPanel'
import { CustomFilters } from './components/CustomFilters'
import { EventsList } from './components/EventsList'
import { Footer } from './components/Footer'

export default function App() {
    const [url, setUrl] = useState('')
    const [bearerToken, setBearerToken] = useState('')
    const [profileName, setProfileName] = useState('')
    const [connected, setConnected] = useState(false)
    const [events, setEvents] = useState<EventMessage[]>([])
    const [error, setError] = useState<string>('')
    const [isLoading, setIsLoading] = useState(false)
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const [connectionTime, setConnectionTime] = useState(0)
    
    const eventSourceRef = useRef<EventSource | null>(null)
    const eventCounterRef = useRef(0)
    const timerIntervalRef = useRef<number | null>(null)

    const { theme, toggleTheme } = useTheme()
    const { 
        profiles, 
        activeProfileTab, 
        setActiveProfileTab, 
        saveProfile: saveProfileHook, 
        deleteProfile 
    } = useProfiles()
    
    const {
        customFilters,
        newFilterField,
        setNewFilterField,
        filteredEvents,
        getUniqueValuesForField,
        addCustomFilter,
        removeCustomFilter,
        toggleFilterValue,
        clearFilterValues
    } = useCustomFilters(events)

    // Connection timer
    useEffect(() => {
        if (connected) {
            setConnectionTime(0)
            timerIntervalRef.current = window.setInterval(() => {
                setConnectionTime(prev => prev + 1)
            }, 1000)
        } else {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current)
                timerIntervalRef.current = null
            }
            setConnectionTime(0)
        }
        return () => {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current)
            }
        }
    }, [connected])

    const copyToClipboard = async (text: string, eventId: string) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopiedId(eventId)
            setTimeout(() => setCopiedId(null), 2000)
        } catch (err) {
            console.error('Error copying:', err)
        }
    }

    const saveProfile = () => {
        if (!profileName.trim() || !url.trim()) {
            setError('Enter a name and URL to save the profile')
            setTimeout(() => setError(''), 2000)
            return
        }

        saveProfileHook(profileName, url, bearerToken)
        setProfileName('')
    }

    const loadProfile = (profile: typeof profiles[0]) => {
        setUrl(profile.url)
        setBearerToken(profile.token)
        setError('')
        setActiveProfileTab(profile.name)
    }

    const connectToSSE = async () => {
        if (!url.trim()) {
            setError('Please enter a valid URL')
            return
        }

        setIsLoading(true)
        setError('')
        setEvents([])
        eventCounterRef.current = 0

        try {
            const authParam = bearerToken ? `&auth=${encodeURIComponent(bearerToken)}` : ''
            const eventSource = new EventSource(`/api/sse?url=${encodeURIComponent(url)}${authParam}`)
            eventSourceRef.current = eventSource

            eventSource.onopen = () => {
                setConnected(true)
                setIsLoading(false)
                setError('')
            }

            eventSource.onerror = (err) => {
                console.error('SSE Error:', err)
                const readyState = eventSource.readyState
                
                if (readyState === EventSource.CLOSED) {
                    setError('Connection closed by server')
                } else if (readyState === EventSource.CONNECTING) {
                    setError('Failed to connect. Check URL and authentication.')
                } else {
                    setError('Connection error occurred')
                }
                
                disconnect()
            }

            eventSource.onmessage = (event) => {
                let parsedType: string | undefined = undefined
                try {
                    const parsed = JSON.parse(event.data)
                    if (parsed && typeof parsed === 'object' && 'type' in parsed) {
                        parsedType = String(parsed.type)
                    }
                } catch {
                    // Not JSON or no type field
                }

                const newEvent: EventMessage = {
                    id: String(eventCounterRef.current++),
                    timestamp: new Date().toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    }),
                    type: 'message',
                    data: event.data,
                    raw: JSON.stringify(event, null, 2),
                    parsedType: parsedType,
                }
                setEvents((prev) => [newEvent, ...prev.slice(0, 99)])
            }
        } catch (err) {
            console.error('Connection error:', err)
            setError('Failed to establish connection')
            setIsLoading(false)
        }
    }

    const disconnect = () => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close()
            eventSourceRef.current = null
        }
        setConnected(false)
        setIsLoading(false)
    }

    const clearEvents = () => {
        setEvents([])
        eventCounterRef.current = 0
    }

    useEffect(() => {
        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close()
            }
        }
    }, [])

    return (
        <div className={`min-h-screen transition-colors duration-300 ${
            theme === 'dark'
                ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
                : 'bg-gradient-to-br from-white via-slate-50 to-slate-100'
        }`}>
            <div className="container mx-auto px-4 py-8">
                <Header theme={theme} onToggleTheme={toggleTheme} />

                <ProfileTabs
                    profiles={profiles}
                    activeProfileTab={activeProfileTab}
                    theme={theme}
                    onLoadProfile={loadProfile}
                    onDeleteProfile={deleteProfile}
                    onSetActiveTab={setActiveProfileTab}
                    onDisconnect={disconnect}
                    connected={connected}
                />

                <Instructions theme={theme} />

                <ConnectionPanel
                    theme={theme}
                    url={url}
                    bearerToken={bearerToken}
                    profileName={profileName}
                    connected={connected}
                    isLoading={isLoading}
                    error={error}
                    connectionTime={connectionTime}
                    eventsLength={events.length}
                    onUrlChange={setUrl}
                    onTokenChange={setBearerToken}
                    onProfileNameChange={setProfileName}
                    onSaveProfile={saveProfile}
                    onConnect={connectToSSE}
                    onDisconnect={disconnect}
                    onClearEvents={clearEvents}
                />

                <CustomFilters
                    theme={theme}
                    connected={connected}
                    customFilters={customFilters}
                    newFilterField={newFilterField}
                    eventsLength={events.length}
                    filteredEventsLength={filteredEvents.length}
                    onNewFilterFieldChange={setNewFilterField}
                    onAddCustomFilter={addCustomFilter}
                    onRemoveCustomFilter={removeCustomFilter}
                    onToggleFilterValue={toggleFilterValue}
                    onClearFilterValues={clearFilterValues}
                    getUniqueValuesForField={getUniqueValuesForField}
                    onError={setError}
                />

                <EventsList
                    theme={theme}
                    connected={connected}
                    filteredEvents={filteredEvents}
                    customFilters={customFilters}
                    copiedId={copiedId}
                    onCopyToClipboard={copyToClipboard}
                />

                <Footer theme={theme} />
            </div>
        </div>
    )
}
