export interface CardData {
    id: string,
    name: string
}

export interface Settings {
    hotkeyCards: {
        F1: Number | null,
        F2: Number | null,
        F3: Number | null,
        F4: Number | null,
        F5: Number | null;
    }
}