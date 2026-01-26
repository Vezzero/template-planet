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
            console.error("Download error:", error);
            alert("Unable to download image.");
        }
    };

    return (
        <div className="modal-overlay-glass" onClick={onClose}>
            <div className="modal-content-glass" onClick={(e) => e.stopPropagation()}>
                
                {/* HEADER: Title & Close X */}
                <div className="modal-header">
                    <h2 className="modal-title">{template.title}</h2>
                    <button onClick={onClose} className="btn-icon-close">
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                {/* IMAGE CONTAINER */}
                <div className="modal-image-container">
                    <img 
                        src={getImageUrl(template.image)} 
                        alt={template.title} 
                    />
                </div>
                
                {/* FOOTER: Actions */}
                <div className="modal-footer">
                    <button className="btn-download-large" onClick={handleDownload}>
                        <i className="bi bi-download"></i> Download Template
                    </button>
                    
                    {/* Optional: Add tags here if you want */}
                    <div className="modal-tags">
                        {template.tags.map(tag => (
                            <span key={tag.id} className="modal-tag-pill">#{tag.name}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};