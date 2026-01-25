import { useEffect, useState } from 'react';
import type { User } from '../App';
import type { MemeTemplate } from '../types';

interface UserDashboardProps {
    user: User;
    onClose: () => void;
}

export const UserDashboard = ({ user, onClose }: UserDashboardProps) => {
    const [myMemes, setMyMemes] = useState<MemeTemplate[]>([]);

    useEffect(() => {
        // Chiede al backend i meme di questo username
        fetch(`/api/templates/my_uploads/?username=${user.username}`)
            .then(res => res.json())
            .then(data => setMyMemes(data))
            .catch(err => console.error(err));
    }, [user.username]);

    // Funzione per formattare la data (es: 25/01/2026 18:30)
    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleString('it-IT', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    // Funzione per il colore dello stato
    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'approved': return <span style={{color: '#42b883', fontWeight:'bold'}}>● Approvato</span>;
            case 'rejected': return <span style={{color: '#ff4757', fontWeight:'bold'}}>● Rifiutato</span>;
            default: return <span style={{color: '#f1c40f', fontWeight:'bold'}}>● In Attesa</span>;
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{minWidth: '500px'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem'}}>
                    <h2>📂 I miei Caricamenti</h2>
                    <button onClick={onClose} className="btn-close">X</button>
                </div>

                <div className="dashboard-list" style={{maxHeight: '60vh', overflowY: 'auto'}}>
                    {myMemes.length === 0 ? (
                        <p>Non hai ancora caricato nessun meme.</p>
                    ) : (
                        myMemes.map(meme => (
                            <div key={meme.id} style={{
                                display: 'flex', gap: '10px', 
                                background: '#333', padding: '10px', 
                                marginBottom: '10px', borderRadius: '8px'
                            }}>
                                <img 
                                    src={meme.image.replace('http://backend:8000', '')} 
                                    style={{width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px'}} 
                                />
                                <div style={{flex: 1}}>
                                    <div style={{fontWeight: 'bold'}}>{meme.title}</div>
                                    <div style={{fontSize: '0.8rem', color: '#aaa'}}>
                                        Caricato il: {formatDate(meme.created_at || '')} {/* Data e Ora */}
                                    </div>
                                    <div style={{fontSize: '0.9rem', marginTop: '5px'}}>
                                        {getStatusBadge(meme.status || 'pending')}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};