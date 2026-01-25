import type { MemeTemplate } from '../types';

interface MemeCardProps {
    template: MemeTemplate;
    onClick: (template: MemeTemplate) => void;
}

export const MemeCard = ({ template, onClick }: MemeCardProps) => {
    // Funzione per correggere l'URL dell'immagine
    const getImageUrl = (url: string) => {
        if (!url) return '';
        // Se Django invia l'indirizzo interno di Docker, lo trasformiamo in un percorso relativo
        // così Vite può usare il proxy correttamente.
        return url.replace('http://backend:8000', '');
    };

    return (
        <div className="meme-card" onClick={() => onClick(template)}>
            {/* Usiamo getImageUrl per correggere il link */}
            <img 
                src={getImageUrl(template.image)} 
                alt={template.title} 
                loading="lazy" 
            />
            <div className="meme-title">{template.title}</div>
        </div>
    );
};