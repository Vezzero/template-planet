export interface Tag {
    id: number;
    name: string;
}

export interface MemeTemplate {
    id: number;
    title: string;
    image: string;
    tags: Tag[];
    status?: 'pending' | 'approved' | 'rejected';
    created_at?: string;
}