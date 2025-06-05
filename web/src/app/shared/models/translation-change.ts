
export interface TranslationChange {
    path: string;
    entries: {
        language: string;
        value: string;
    }[];
}
