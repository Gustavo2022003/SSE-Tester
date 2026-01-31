import { useState, useMemo } from 'react'
import type { EventMessage, CustomFilter } from '../types'
import { getFieldValue } from '../utils/eventUtils'

export const useCustomFilters = (events: EventMessage[]) => {
    const [customFilters, setCustomFilters] = useState<CustomFilter[]>([])
    const [newFilterField, setNewFilterField] = useState('')

    const getUniqueValuesForField = (fieldPath: string): string[] => {
        const values = new Set<string>()
        events.forEach(event => {
            const value = getFieldValue(event, fieldPath)
            if (value !== null) {
                values.add(value)
            }
        })
        return Array.from(values).sort()
    }

    const addCustomFilter = (): string | null => {
        if (!newFilterField.trim()) return null
        
        if (customFilters.some(f => f.field === newFilterField.trim())) {
            return 'This filter already exists'
        }

        setCustomFilters([...customFilters, { field: newFilterField.trim(), activeValues: new Set() }])
        setNewFilterField('')
        return null
    }

    const removeCustomFilter = (field: string) => {
        setCustomFilters(customFilters.filter(f => f.field !== field))
    }

    const toggleFilterValue = (field: string, value: string) => {
        setCustomFilters(customFilters.map(filter => {
            if (filter.field === field) {
                const newActiveValues = new Set(filter.activeValues)
                if (newActiveValues.has(value)) {
                    newActiveValues.delete(value)
                } else {
                    newActiveValues.add(value)
                }
                return { ...filter, activeValues: newActiveValues }
            }
            return filter
        }))
    }

    const clearFilterValues = (field: string) => {
        setCustomFilters(customFilters.map(filter => 
            filter.field === field ? { ...filter, activeValues: new Set() } : filter
        ))
    }

    const filteredEvents = useMemo(() => {
        if (customFilters.length === 0) return events
        
        return events.filter(event => {
            return customFilters.every(filter => {
                if (filter.activeValues.size === 0) return true
                
                const eventValue = getFieldValue(event, filter.field)
                return eventValue !== null && filter.activeValues.has(eventValue)
            })
        })
    }, [events, customFilters])

    return {
        customFilters,
        newFilterField,
        setNewFilterField,
        filteredEvents,
        getUniqueValuesForField,
        addCustomFilter,
        removeCustomFilter,
        toggleFilterValue,
        clearFilterValues
    }
}
