import type { MemeTemplate } from '../types';

interface MemeModalProps {
    template: MemeTemplate;
    onClose: () => void;
}

export const MemeModal = ({ template, onClose }: MemeModalProps) => {
    
    const getImageUrl = (url: string) => {
        if (!url) return '';
        return url.replace('http://backend:8000', '');
    };

    const handleDownload = async () => {
        try {
            const imageUrl = getImageUrl(template.image);
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `${template.title.replace(/\s+/g, '_')}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Errore download:", error);
            alert("Impossibile scaricare l'immagine.");
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>{template.title}</h2>
                <img 
                    src={getImageUrl(template.image)} 
                    alt={template.title} 
                    className="modal-image" 
                />
                
                <div className="button-group">
                    <button className="btn-download" onClick={handleDownload}>
                        Scarica Template
                    </button>
                    <button className="btn-close" onClick={onClose}>
                        Chiudi
                    </button>
                </div>
            </div>
        </div>
    );
};