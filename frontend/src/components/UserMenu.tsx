interface User {
    username: string;
    is_staff: boolean;
}

interface UserMenuProps {
    user: User | null;
    onLoginSuccess: (userData: User) => void;
    onLogout: () => void;
    onAdminClick: () => void;
    onUploadClick: () => void;
    onMyUploadsClick: () => void;
}

export const UserMenu = ({ user, onLoginSuccess, onLogout, onAdminClick, onUploadClick, onMyUploadsClick }: UserMenuProps) => {

    // Funzione per simulare il login come ADMIN (vede il tasto Admin)
    const fakeLoginAdmin = () => {
        onLoginSuccess({ username: 'Super Admin', is_staff: true });
    };

    // Funzione per simulare il login come UTENTE (NON vede il tasto Admin)
    const fakeLoginUser = () => {
        onLoginSuccess({ username: 'Utente Simpatico', is_staff: false });
    };

    // SE L'UTENTE È LOGGATO
    if (user) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ color: '#fff', fontWeight: '500' }}>Ciao, {user.username}!</span>
                
                <button 
                    onClick={onMyUploadsClick}
                    style={{background: 'none', border: 'none', color: '#aadaff', cursor: 'pointer', textDecoration:'underline'}}
                >
                    I miei Upload
                </button>

                <button className="nav-btn-upload" onClick={onUploadClick}>Carica Meme</button>

                {/* Il tasto Admin appare SOLO se l'utente è staff */}
                {user.is_staff && (
                    <button 
                        onClick={onAdminClick} 
                        style={{
                            background: '#ff4757', 
                            color: 'white', 
                            border: 'none', 
                            padding: '0.5rem 1rem', 
                            borderRadius: '6px', 
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            boxShadow: '0 2px 4px rgba(255, 71, 87, 0.3)'
                        }}
                    >
                        Admin Panel
                    </button>
                )}

                <button 
                    onClick={onLogout} 
                    style={{
                        background: 'transparent', 
                        border: '1px solid #666', 
                        color: '#ccc', 
                        padding: '0.5rem 1rem', 
                        borderRadius: '6px', 
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    Esci
                </button>
            </div>
        );
    }

    // SE L'UTENTE NON È LOGGATO (Mostra i bottoni di test)
    return (
        <div style={{ display: 'flex', gap: '10px' }}>
            <button 
                onClick={fakeLoginUser}
                style={{ 
                    background: '#333', 
                    color: 'white', 
                    border: '1px solid #555', 
                    padding: '0.5rem 1rem', 
                    borderRadius: '20px', 
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                }}
            >
                Login User
            </button>
            
            <button 
                onClick={fakeLoginAdmin}
                style={{ 
                    background: '#1e1e1e', 
                    color: '#42b883', 
                    border: '1px solid #42b883', 
                    padding: '0.5rem 1rem', 
                    borderRadius: '20px', 
                    cursor: 'pointer', 
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                }}
            >
                Login Admin (Test)
            </button>
        </div>
    );
};