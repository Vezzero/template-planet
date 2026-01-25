import { useState, useEffect } from 'react';
import type { MemeTemplate } from '../types';
import '../App.css';

interface AdminPageProps {
    onBack: () => void;
}

export const AdminPage = ({ onBack }: AdminPageProps) => {
    const [pendingMemes, setPendingMemes] = useState<MemeTemplate[]>([]);

    const fetchPending = () => {
        // Chiamiamo l'endpoint speciale che abbiamo creato
        fetch('/api/templates/pending/')
            .then(res => res.json())
            .then(data => setPendingMemes(data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const handleModerate = async (id: number, newStatus: 'approved' | 'rejected') => {
        try {
            await fetch(`/api/templates/${id}/moderate/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            // Ricarica la lista
            fetchPending();
        } catch (error) {
            alert("Errore aggiornamento");
        }
    };

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h2>👮‍♂️ Pannello Moderazione</h2>
                <button onClick={onBack} className="btn-back">Torna al Sito</button>
            </header>

            {pendingMemes.length === 0 ? (
                <p style={{textAlign: 'center', marginTop: '2rem'}}>Nessun meme in attesa di approvazione.</p>
            ) : (
                <div className="admin-grid">
                    {pendingMemes.map(meme => (
                        <div key={meme.id} className="admin-card">
                            <img src={meme.image.replace('http://backend:8000', '')} alt={meme.title} />
                            <div className="admin-card-body">
                                <h4>{meme.title}</h4>
                                <div className="admin-actions">
                                    <button 
                                        className="btn-approve" 
                                        onClick={() => handleModerate(meme.id, 'approved')}
                                    >
                                        ✅ Approva
                                    </button>
                                    <button 
                                        className="btn-reject" 
                                        onClick={() => handleModerate(meme.id, 'rejected')}
                                    >
                                        ❌ Rifiuta
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};