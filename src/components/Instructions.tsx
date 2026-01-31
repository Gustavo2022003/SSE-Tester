import type { Theme } from '../types'

interface InstructionsProps {
    theme: Theme
}

export const Instructions = ({ theme }: InstructionsProps) => {
    return (
        <div className={`rounded-lg p-4 mb-8 border ${
            theme === 'dark'
                ? 'bg-blue-900/20 border-blue-800'
                : 'bg-blue-50 border-blue-200'
        }`}>
            <h3 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-900'}`}>
                📋 How to use:
            </h3>
            <ol className={`text-sm space-y-1 list-decimal list-inside ${
                theme === 'dark' ? 'text-blue-200' : 'text-blue-800'
            }`}>
                <li>Enter the SSE endpoint URL</li>
                <li>Paste the Bearer token (optional)</li>
                <li>Save a profile to reuse later</li>
                <li>Click "Connect"</li>
            </ol>
        </div>
    )
}
