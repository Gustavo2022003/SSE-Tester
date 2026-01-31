export interface EventMessage {
    id: string
    timestamp: string
    type: string
    data: string
    raw: string
    parsedType?: string
}

export interface Profile {
    name: string
    url: string
    token: string
}

export interface CustomFilter {
    field: string
    activeValues: Set<string>
}

export type Theme = 'dark' | 'light'
