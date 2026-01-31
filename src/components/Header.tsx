import type { Theme } from '../types'

interface HeaderProps {
    theme: Theme
    onToggleTheme: () => void
}

export const Header = ({ theme, onToggleTheme }: HeaderProps) => {
    return (
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className={`text-5xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    🎯 SSE Monitor
                </h1>
                <p className={`text-lg ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    Monitor Server-Sent Events in real-time
                </p>
            </div>
            <button
                onClick={onToggleTheme}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    theme === 'dark'
                        ? 'bg-amber-500 hover:bg-amber-600 text-white'
                        : 'bg-slate-800 hover:bg-slate-900 text-white'
                }`}
            >
                {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
        </div>
    )
}
