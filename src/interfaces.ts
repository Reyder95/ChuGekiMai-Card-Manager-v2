export interface CardData {
    id: string,
    name: string,
    key?: string
}

export interface Settings {
    hotkeyCards: {
        F1: CardData | null,
        F2: CardData | null,
        F3: CardData | null,
        F4: CardData | null,
        F5: CardData | null;
    }
}