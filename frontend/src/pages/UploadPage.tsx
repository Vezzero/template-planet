import { useState } from 'react';
import '../App.css';

interface UploadPageProps {
    onBack: () => void; // Funzione per tornare alla home
}

export const UploadPage = ({ onBack }: UploadPageProps) => {
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Gestione selezione file e anteprima
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // Invio del form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !image) {
            alert("Titolo e Immagine sono obbligatori!");
            return;
        }

        setIsLoading(true);

        // Usiamo FormData per inviare file + testo
        const formData = new FormData();
        formData.append('title', title);
        formData.append('image', image);
        formData.append('tags_input', tags); // Nota: deve chiamarsi come nel serializer Django

        try {
            const response = await fetch('/api/templates/', {
                method: 'POST',
                body: formData, // Non mettere headers 'Content-Type', il browser lo mette da solo per i file!
            });

            if (response.ok) {
                alert("Meme caricato con successo! 🚀");
                onBack(); // Torna alla home
            } else {
                console.error("Errore server:", await response.text());
                alert("Errore durante il caricamento.");
            }
        } catch (error) {
            console.error("Errore di rete:", error);
            alert("Impossibile contattare il server.");
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
                    {/* Campo Titolo */}
                    <div className="form-group">
                        <label>Titolo</label>
                        <input 
                            type="text" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            placeholder="Es. Gatto Computer" 
                            className="search-input" // Ricicliamo lo stile dell'input
                        />
                    </div>

                    {/* Campo Tag */}
                    <div className="form-group">
                        <label>Tag (separati da virgola)</label>
                        <input 
                            type="text" 
                            value={tags} 
                            onChange={(e) => setTags(e.target.value)} 
                            placeholder="Es. gatto, tech, divertente" 
                            className="search-input"
                        />
                    </div>

                    {/* Campo File */}
                    <div className="form-group">
                        <label>Immagine</label>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange}
                            className="file-input"
                        />
                    </div>

                    {/* Anteprima */}
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