import type { Theme } from '../types'
import { formatTime } from '../utils/eventUtils'

interface ConnectionPanelProps {
    theme: Theme
    url: string
    bearerToken: string
    profileName: string
    connected: boolean
    isLoading: boolean
    error: string
    connectionTime: number
    eventsLength: number
    onUrlChange: (url: string) => void
    onTokenChange: (token: string) => void
    onProfileNameChange: (name: string) => void
    onSaveProfile: () => void
    onConnect: () => void
    onDisconnect: () => void
    onClearEvents: () => void
}

export const ConnectionPanel = ({
    theme,
    url,
    bearerToken,
    profileName,
    connected,
    isLoading,
    error,
    connectionTime,
    eventsLength,
    onUrlChange,
    onTokenChange,
    onProfileNameChange,
    onSaveProfile,
    onConnect,
    onDisconnect,
    onClearEvents
}: ConnectionPanelProps) => {
    return (
        <div className={`rounded-lg shadow-xl p-6 mb-8 border transition-colors ${
            theme === 'dark'
                ? 'bg-slate-800 border-slate-700'
                : 'bg-white border-slate-200'
        }`}>
            <div className="flex flex-col gap-4">
                <div>
                    <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                        SSE Endpoint URL
                    </label>
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => onUrlChange(e.target.value)}
                        placeholder="https://api.example.com/sse"
                        disabled={connected || isLoading}
                        className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-colors ${
                            theme === 'dark'
                                ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/50'
                                : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/50'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && !connected && !isLoading) {
                                onConnect()
                            }
                        }}
                    />
                </div>

                <div>
                    <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                        Bearer Token (optional)
                    </label>
                    <input
                        type="password"
                        value={bearerToken}
                        onChange={(e) => onTokenChange(e.target.value)}
                        placeholder="Paste your token here"
                        disabled={connected || isLoading}
                        className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-colors ${
                            theme === 'dark'
                                ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/50'
                                : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/50'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    />
                    <p className={`text-xs mt-1 ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                        🔒 Token will be sent as header: Authorization: Bearer &lt;your-token&gt;
                    </p>
                </div>

                <div>
                    <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                        Save as Profile (optional)
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={profileName}
                            onChange={(e) => onProfileNameChange(e.target.value)}
                            placeholder="Profile name"
                            disabled={connected || isLoading}
                            className={`flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-colors ${
                                theme === 'dark'
                                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/50'
                                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/50'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                        />
                        <button
                            onClick={onSaveProfile}
                            disabled={connected || isLoading || !profileName.trim()}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                        >
                            💾 Save
                        </button>
                    </div>
                </div>

                {error && (
                    <div className={`border rounded-lg p-3 text-sm ${
                        theme === 'dark'
                            ? 'bg-red-900/20 border-red-800 text-red-400'
                            : 'bg-red-50 border-red-300 text-red-700'
                    }`}>
                        ⚠️ {error}
                    </div>
                )}

                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div
                            className={`w-3 h-3 rounded-full ${connected
                                    ? 'bg-green-500 animate-pulse'
                                    : 'bg-slate-500'
                            }`}
                        />
                        <span className="text-sm">
                            {connected && (
                                <span className="text-green-400">Connected</span>
                            )}
                            {!connected && isLoading && (
                                <span className="text-yellow-400">Connecting...</span>
                            )}
                            {!connected && !isLoading && (
                                <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>Disconnected</span>
                            )}
                        </span>
                    </div>
                    {connected && (
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${
                            theme === 'dark'
                                ? 'bg-slate-700 border-slate-600 text-slate-300'
                                : 'bg-slate-100 border-slate-200 text-slate-700'
                        }`}>
                            <span className="text-xs">⏱️</span>
                            <span className="text-sm font-mono font-semibold">{formatTime(connectionTime)}</span>
                        </div>
                    )}
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onConnect}
                        disabled={connected || isLoading}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                    >
                        {isLoading ? 'Connecting...' : 'Connect'}
                    </button>
                    <button
                        onClick={onDisconnect}
                        disabled={!connected && !isLoading}
                        className={`flex-1 px-4 py-2 font-medium rounded-lg transition-colors text-white ${
                            !connected && !isLoading
                                ? 'bg-slate-600 cursor-not-allowed'
                                : isLoading
                                ? 'bg-orange-600 hover:bg-orange-700'
                                : 'bg-red-600 hover:bg-red-700'
                        }`}
                    >
                        {isLoading ? 'Abort' : 'Disconnect'}
                    </button>
                    <button
                        onClick={onClearEvents}
                        disabled={eventsLength === 0}
                        className="px-4 py-2 bg-slate-600 hover:bg-slate-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                    >
                        Clear
                    </button>
                </div>
            </div>
        </div>
    )
}
