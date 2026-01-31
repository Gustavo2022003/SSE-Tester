import type { Theme, CustomFilter } from '../types'

interface CustomFiltersProps {
    theme: Theme
    connected: boolean
    customFilters: CustomFilter[]
    newFilterField: string
    eventsLength: number
    filteredEventsLength: number
    onNewFilterFieldChange: (field: string) => void
    onAddCustomFilter: () => string | null
    onRemoveCustomFilter: (field: string) => void
    onToggleFilterValue: (field: string, value: string) => void
    onClearFilterValues: (field: string) => void
    getUniqueValuesForField: (field: string) => string[]
    onError: (error: string) => void
}

export const CustomFilters = ({
    theme,
    connected,
    customFilters,
    newFilterField,
    eventsLength,
    filteredEventsLength,
    onNewFilterFieldChange,
    onAddCustomFilter,
    onRemoveCustomFilter,
    onToggleFilterValue,
    onClearFilterValues,
    getUniqueValuesForField,
    onError
}: CustomFiltersProps) => {
    if (!connected) return null

    const handleAddFilter = () => {
        const error = onAddCustomFilter()
        if (error) {
            onError(error)
            setTimeout(() => onError(''), 2000)
        }
    }

    return (
        <div className={`rounded-lg shadow-xl p-6 mb-6 border ${
            theme === 'dark'
                ? 'bg-slate-800 border-slate-700'
                : 'bg-white border-slate-200'
        }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
                🔍 Custom Filters
            </h3>

            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={newFilterField}
                    onChange={(e) => onNewFilterFieldChange(e.target.value)}
                    placeholder="Field to filter (e.g. type, data.userId, status)"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddFilter()}
                    className={`flex-1 px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
                        theme === 'dark'
                            ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/50'
                            : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/50'
                    }`}
                />
                <button
                    onClick={handleAddFilter}
                    disabled={!newFilterField.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors text-sm"
                >
                    ➕ Add
                </button>
            </div>

            <div className={`text-sm mb-4 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                Total events: <span className="font-bold text-blue-500">{eventsLength}</span>
                {customFilters.some(f => f.activeValues.size > 0) && (
                    <span className="ml-2 text-amber-500">({filteredEventsLength} filtered)</span>
                )}
            </div>

            {customFilters.length === 0 ? (
                <p className={`text-sm text-center py-4 ${
                    theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                }`}>
                    No filters added. Enter a field above to start.
                </p>
            ) : (
                <div className="space-y-4">
                    {customFilters.map(filter => {
                        const availableValues = getUniqueValuesForField(filter.field)
                        return (
                            <div
                                key={filter.field}
                                className={`p-4 rounded-lg border ${
                                    theme === 'dark'
                                        ? 'bg-slate-700/50 border-slate-600'
                                        : 'bg-slate-50 border-slate-200'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className={`font-semibold text-sm ${
                                            theme === 'dark' ? 'text-white' : 'text-slate-900'
                                        }`}>
                                            {filter.field}
                                        </span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                                            theme === 'dark'
                                                ? 'bg-slate-600 text-slate-300'
                                                : 'bg-slate-200 text-slate-600'
                                        }`}>
                                            {availableValues.length} values
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        {filter.activeValues.size > 0 && (
                                            <button
                                                onClick={() => onClearFilterValues(filter.field)}
                                                className={`text-xs px-2 py-1 rounded transition-colors ${
                                                    theme === 'dark'
                                                        ? 'bg-slate-600 hover:bg-slate-500 text-slate-300'
                                                        : 'bg-slate-300 hover:bg-slate-400 text-slate-700'
                                                }`}
                                            >
                                                Clear
                                            </button>
                                        )}
                                        <button
                                            onClick={() => onRemoveCustomFilter(filter.field)}
                                            className={`text-xs px-2 py-1 rounded transition-colors ${
                                                theme === 'dark'
                                                    ? 'bg-red-900/30 hover:bg-red-900/50 text-red-400'
                                                    : 'bg-red-100 hover:bg-red-200 text-red-700'
                                            }`}
                                        >
                                            ✕ Remove
                                        </button>
                                    </div>
                                </div>
                                
                                {availableValues.length === 0 ? (
                                    <p className={`text-xs ${
                                        theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                                    }`}>
                                        No values found for this field
                                    </p>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {availableValues.map(value => (
                                            <button
                                                key={value}
                                                onClick={() => onToggleFilterValue(filter.field, value)}
                                                className={`px-3 py-1 text-xs font-semibold rounded transition-all flex items-center gap-2 ${
                                                    filter.activeValues.has(value)
                                                        ? 'bg-blue-600 text-white border-2 border-blue-400'
                                                        : theme === 'dark'
                                                        ? 'bg-slate-600 text-slate-300 border-2 border-slate-500 hover:bg-slate-500'
                                                        : 'bg-slate-200 text-slate-700 border-2 border-slate-300 hover:bg-slate-300'
                                                }`}
                                            >
                                                {value}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
