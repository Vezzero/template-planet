import { useState, useEffect } from 'react';
import type { MemeTemplate } from '../types';
import type { User } from '../App';
import { MemeCard } from '../components/MemeCard';
import { MemeModal } from '../components/MemeModal';
import { UserMenu } from '../components/UserMenu';
import { UserDashboard } from '../components/UserDashboard';
import '../App.css';

interface LandingPageProps {
    user: User | null;
    onLogin: (u: User) => void;
    onLogout: () => void;
    onNavigateToUpload: () => void;
    onNavigateToAdmin: () => void;
}

export const LandingPage = ({ 
    user, 
    onLogin, 
    onLogout, 
    onNavigateToUpload, 
    onNavigateToAdmin 
}: LandingPageProps) => {
    
    const [templates, setTemplates] = useState<MemeTemplate[]>([]);
    const [selectedMeme, setSelectedMeme] = useState<MemeTemplate | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    const [showDashboard, setShowDashboard] = useState(false);

    useEffect(() => {
        fetch('/api/templates/')
            .then((res) => res.json())
            .then((data) => setTemplates(data))
            .catch((err) => console.error("Errore fetch:", err));
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this meme?")) {
            return;
        }

        try {
            const response = await fetch(`/api/templates/${id}/`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setTemplates(prev => prev.filter(t => t.id !== id));
            } else {
                alert("Error deleting meme.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Connection error.");
        }
    };

    const filteredTemplates = templates.filter((meme) => {
        const searchLower = searchTerm.toLowerCase();
        const matchTitle = meme.title.toLowerCase().includes(searchLower);
        const matchTags = meme.tags.some(tag => tag.name.toLowerCase().includes(searchLower));
        return matchTitle || matchTags;
    });

    return (
        <div className="app-wrapper">
            
            {/* FIXED HEADER */}
            <header className="app-header fixed-header">
                
                {/* 1. LOGO PLACEHOLDER (Empty for now) */}
                <div className="logo-area" style={{ width: '150px' }}>
                   {/* Put <img src="..." /> here later */}
                </div>

                <div className="header-search-container">
                    <i className="bi bi-search search-icon"></i>
                    <input 
                        type="text" 
                        placeholder="Search templates..." 
                        className="header-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* 3. USER MENU */}
                <nav className="main-nav">
                    <UserMenu 
                        user={user}
                        onLoginSuccess={onLogin}
                        onLogout={onLogout}
                        onUploadClick={onNavigateToUpload}
                        onAdminClick={onNavigateToAdmin}
                        onMyUploadsClick={() => setShowDashboard(true)}
                    />
                </nav>
            </header>

            <div className="layout-container with-fixed-header">
                
                {/* SIDEBAR */}
                <aside className="app-sidebar">
                    <div className="filter-group">
                        <h3>Categories</h3>
                        <ul className="filter-list">
                            <li className={`filter-item ${activeFilter === 'All' ? 'active' : ''}`} onClick={() => setActiveFilter('All')}>
                                <i className="bi bi-grid-fill"></i> All Templates
                            </li>
                            <li className="filter-item"><i className="bi bi-fire"></i> Trending</li>
                            <li className="filter-item"><i className="bi bi-stars"></i> New</li>
                        </ul>
                    </div>
                </aside>

                {/* CONTENT AREA */}
                <main className="main-content">
                    {/* Hero Section reduced slightly since search is gone */}
                    <div className="hero-section">
                        <h2>Explore the collection</h2>
                    </div>

                    <h3 style={{ marginBottom: '1rem', color: '#888', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Results ({filteredTemplates.length})
                    </h3>

                    <div className="meme-scroll-container">
                        {filteredTemplates.map((meme) => (
                            <MemeCard 
                                key={meme.id} 
                                template={meme} 
                                onClick={setSelectedMeme} 
                                isAdmin={user?.is_staff} 
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>

                    {filteredTemplates.length === 0 && (
                        <div className="empty-state">
                            <i className="bi bi-emoji-frown" style={{fontSize: '2rem', marginBottom: '10px'}}></i>
                            <p>No templates found.</p>
                        </div>
                    )}
                </main>
            </div>

            <footer className="app-footer">
                <div className="footer-content">
                    © 2026 Template Planet - All rights reserved.
                </div>
            </footer>

            {/* MODALS */}
            {selectedMeme && (
                <MemeModal 
                    template={selectedMeme} 
                    onClose={() => setSelectedMeme(null)} 
                />
            )}

            {showDashboard && user && (
                <UserDashboard user={user} onClose={() => setShowDashboard(false)} />
            )}
        </div>
    );
};