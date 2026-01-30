import type { MemeTemplate } from '../types';

interface MemeCardProps {
    template: MemeTemplate;
    onClick: (template: MemeTemplate) => void;
    isAdmin?: boolean; 
    onDelete?: (id: number) => void;
}

export const MemeCard = ({ template, onClick, isAdmin, onDelete }: MemeCardProps) => {
    
    const getImageUrl = (url: string) => {
        if (!url) return '';
        return url.replace('http://backend:8000', '');
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation(); 
        if (onDelete) {
            onDelete(template.id);
        }
    };

    const handleDownloadClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        const imageUrl = getImageUrl(template.image);
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = template.title + '.jpg'; // You can set a default extension or try to extract it
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="meme-card" onClick={() => onClick(template)}>
            
            {/* WRAPPER IMMAGINE (Per gestire zoom e overlay) */}
            <div className="meme-card-image-wrapper">
                <img 
                    src={getImageUrl(template.image)} 
                    alt={template.title} 
                    loading="lazy" 
                />
                
                {/* Overlay sfumato al passaggio del mouse */}
                <div className="meme-card-overlay"></div>

                {/* BOTTONE ELIMINA (Appare solo on hover) */}
                {isAdmin && onDelete && (
                    <button 
                        className="btn-delete-card" 
                        onClick={handleDeleteClick} 
                        title="Delete Meme"
                    >
                        <i className="bi bi-trash3-fill"></i>
                    </button>
                )}
            </div>
            
            {/* INFO CONTENUTO */}
            <div className="meme-card-content">
                <h3 className="meme-card-title">{template.title}</h3>
                
                <div className="meme-card-tags">
                    {template.tags.length > 0 ? (
                        template.tags.map(t => (
                            <span key={t.id} className="meme-tag">#{t.name}</span>
                        ))
                    ) : (
                        <span className="meme-tag-empty">No tags</span>
                    )}
                </div>

                {/* DOWNLOAD BUTTON */}
                <button
                    className="btn-download-card"
                    onClick={handleDownloadClick}
                    title="Download"
                    >
                    <i className="bi bi-download"></i>
                    </button>

            </div>
        </div>
    );
};