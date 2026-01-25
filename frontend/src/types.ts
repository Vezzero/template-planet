// Aggiungiamo l'interfaccia per il Tag singolo
export interface Tag {
    id: number;
    name: string;
}

export interface MemeTemplate {
    id: number;
    title: string;
    image: string;
    tags: Tag[]; // <-- ORA È UNA LISTA DI OGGETTI, NON DI STRINGHE
}