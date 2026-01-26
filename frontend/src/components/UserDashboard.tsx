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
        fetch(`/api/templates/my_uploads/?username=${user.username}`)
            .then(res => res.json())
            .then(data => setMyMemes(data))
            .catch(err => console.error(err));
    }, [user.username]);

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleString('en-US', {
            day: '2-digit', month: '2-digit', year: '2-digit',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const getStatusBadge = (status: string) => {
        const style = { display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold', fontSize: '0.75rem' };
        switch(status) {
            case 'approved': 
                return <span style={{...style, color: '#42b883'}}><i className="bi bi-check-circle-fill"></i> Approved</span>;
            case 'rejected': 
                return <span style={{...style, color: '#ff4757'}}><i className="bi bi-x-circle-fill"></i> Rejected</span>;
            default: 
                return <span style={{...style, color: '#f1c40f'}}><i className="bi bi-hourglass-split"></i> Waiting</span>;
        }
    };

    return (
        // CHANGED: No overlay. Fixed position to float inside the page.
        <div 
            className="dashboard-panel"
            style={{
                position: 'fixed',
                top: '80px',        // Below the header
                right: '20px',      // Stuck to the right
                width: '320px',     // Compact width
                maxHeight: '500px', // Limit height
                backgroundColor: '#1e1e1e',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                border: '1px solid #333',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}
        >
            {/* HEADER - Compact */}
            <div style={{
                padding: '12px 15px', 
                background: '#252525', 
                borderBottom: '1px solid #333',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h4 style={{margin: 0, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#eee'}}>
                    <i className="bi bi-cloud-arrow-up-fill"></i> My Uploads
                </h4>
                
                {/* Close Button */}
                <button 
                    onClick={onClose} 
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#aaa',
                        cursor: 'pointer',
                        fontSize: '1.2rem',
                        padding: 0,
                        lineHeight: 1
                    }}
                >
                    <i className="bi bi-x"></i>
                </button>
            </div>

            {/* LIST - Compact */}
            <div style={{
                padding: '10px', 
                overflowY: 'auto', 
                flex: 1
            }}>
                {myMemes.length === 0 ? (
                    <p style={{ color: '#888', fontSize: '0.85rem', textAlign: 'center', margin: '20px 0' }}>
                        No uploads yet.
                    </p>
                ) : (
                    myMemes.map(meme => (
                        <div key={meme.id} style={{
                            display: 'flex', 
                            gap: '10px', 
                            background: '#2a2a2a', 
                            padding: '8px', 
                            marginBottom: '8px', 
                            borderRadius: '6px',
                            border: '1px solid #3a3a3a',
                            alignItems: 'center'
                        }}>
                            {/* Tiny Thumbnail */}
                            <img 
                                src={meme.image.replace('http://backend:8000', '')} 
                                style={{width: '45px', height: '45px', objectFit: 'cover', borderRadius: '4px'}} 
                                alt="preview"
                            />
                            
                            {/* Compact Info */}
                            <div style={{flex: 1, minWidth: 0}}>
                                <div style={{
                                    fontWeight: '600', 
                                    fontSize: '0.9rem', 
                                    color: '#fff',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                                    {meme.title}
                                </div>
                                <div style={{fontSize: '0.7rem', color: '#888', marginBottom: '2px'}}>
                                    {formatDate(meme.created_at || '')}
                                </div>
                                <div>
                                    {getStatusBadge(meme.status || 'pending')}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};