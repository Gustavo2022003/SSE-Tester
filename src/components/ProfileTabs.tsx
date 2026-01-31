import type { Profile, Theme } from '../types'

interface ProfileTabsProps {
    profiles: Profile[]
    activeProfileTab: string | null
    theme: Theme
    onLoadProfile: (profile: Profile) => void
    onDeleteProfile: (name: string) => void
    onSetActiveTab: (name: string) => void
    onDisconnect: () => void
    connected: boolean
}

export const ProfileTabs = ({ 
    profiles, 
    activeProfileTab, 
    theme, 
    onLoadProfile, 
    onDeleteProfile,
    onSetActiveTab,
    onDisconnect,
    connected
}: ProfileTabsProps) => {
    if (profiles.length === 0) return null

    const handleProfileClick = (profile: Profile) => {
        onLoadProfile(profile)
        if (connected) onDisconnect()
    }

    return (
        <div className="mb-6">
            <div className={`flex gap-2 flex-wrap border-b pb-4 ${
                theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
            }`}>
                {profiles.map(profile => (
                    <button
                        key={profile.name}
                        onClick={() => handleProfileClick(profile)}
                        className={`px-4 py-2 rounded-t-lg font-medium transition-all relative group ${
                            activeProfileTab === profile.name
                                ? theme === 'dark'
                                    ? 'bg-slate-700 text-white border-b-2 border-blue-500'
                                    : 'bg-white text-slate-900 border-b-2 border-blue-600 shadow-md'
                                : theme === 'dark'
                                ? 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                    >
                        <span>{profile.name}</span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                onDeleteProfile(profile.name)
                            }}
                            className={`ml-2 transition-colors ${
                                theme === 'dark'
                                    ? 'hover:text-red-400'
                                    : 'hover:text-red-600'
                            }`}
                            title="Delete profile"
                        >
                            ✕
                        </button>
                    </button>
                ))}
                <button
                    onClick={() => onSetActiveTab('new')}
                    className={`px-4 py-2 rounded-t-lg font-medium transition-all ${
                        activeProfileTab === 'new'
                            ? theme === 'dark'
                                ? 'bg-slate-700 text-white border-b-2 border-green-500'
                                : 'bg-white text-slate-900 border-b-2 border-green-600 shadow-md'
                            : theme === 'dark'
                            ? 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                >
                    ➕ New
                </button>
            </div>
        </div>
    )
}
