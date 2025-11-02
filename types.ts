// This file is reserved for custom type definitions.
export interface Color {
    hex: string;
    name: string;
    description: string;
}

export interface FontPairing {
    header: string;
    body: string;
}

export interface BrandIdentity {
    primaryLogo: string;
    secondaryMarkIcon: string;
    secondaryMarkWordmark: string;
    colorPalette: Color[];
    fontPairing: FontPairing | null;
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export enum AppView {
    IMAGE,
    CHAT,
}
