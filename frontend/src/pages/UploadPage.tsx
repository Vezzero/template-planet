import { useState, useEffect } from 'react';
import '../App.css';

interface Tag {
    id: number;
    name: string;
}

interface UploadPageProps {
    onBack: () => void;
}

export const UploadPage = ({ onBack }: UploadPageProps) => {
    const [title, setTitle] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // NUOVI STATI PER I TAG
    const [availableTags, setAvailableTags] = useState<Tag[]>([]); // Tag scaricati dal DB
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]); // ID selezionati dall'utente

    // 1. Carichiamo i tag appena si apre la pagina
    useEffect(() => {
        fetch('/api/tags/')
            .then(res => res.json())
            .then(data => setAvailableTags(data))
            .catch(err => console.error("Errore caricamento tag:", err));
    }, []);

    // Gestione click sul tag (Seleziona/Deseleziona)
    const toggleTag = (id: number) => {
        if (selectedTagIds.includes(id)) {
            setSelectedTagIds(selectedTagIds.filter(tagId => tagId !== id));
        } else {
            setSelectedTagIds([...selectedTagIds, id]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !image) {
            alert("Titolo e Immagine sono obbligatori!");
            return;
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('image', image);
        
        // IMPORTANTE: Appendiamo ogni ID separatamente
        // Django li leggerà come una lista
        selectedTagIds.forEach(id => {
            formData.append('tag_ids', id.toString());
        });

        try {
            const response = await fetch('/api/templates/', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                alert("Meme caricato con successo! 🚀");
                onBack();
            } else {
                const errorText = await response.text();
                console.error("Errore server:", errorText);
                alert("Errore caricamento: " + errorText);
            }
        } catch (error) {
            console.error(error);
            alert("Errore di rete.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="upload-container">
            <button className="btn-back" onClick={onBack}>← Torna alla Gallery</button>
            
            <div className="upload-card">
                <h2>Carica un nuovo Template</h2>
                
                <form onSubmit={handleSubmit} className="upload-form">
                    <div className="form-group">
                        <label>Titolo</label>
                        <input 
                            type="text" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            placeholder="Es. Gatto Computer" 
                            className="search-input"
                        />
                    </div>

                    {/* SELEZIONE TAG A PULSANTI */}
                    <div className="form-group">
                        <label>Seleziona Categorie:</label>
                        <div className="tags-selection-container">
                            {availableTags.length === 0 ? (
                                <p style={{color: '#666', fontSize: '0.9rem'}}>Nessun tag disponibile. Creane uno dal pannello Admin.</p>
                            ) : (
                                availableTags.map(tag => (
                                    <div 
                                        key={tag.id}
                                        className={`tag-chip ${selectedTagIds.includes(tag.id) ? 'selected' : ''}`}
                                        onClick={() => toggleTag(tag.id)}
                                    >
                                        {tag.name}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Immagine</label>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange}
                            className="file-input"
                        />
                    </div>

                    {preview && (
                        <div className="preview-box">
                            <img src={preview} alt="Anteprima" />
                        </div>
                    )}

                    <button type="submit" className="btn-download" disabled={isLoading}>
                        {isLoading ? 'Caricamento...' : 'Pubblica Meme'}
                    </button>
                </form>
            </div>
        </div>
    );
};