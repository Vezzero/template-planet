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
    
    // STATI LAYOUT
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    
    // STATI DROPDOWN SIDEBAR (Nuovi)
    const [openSections, setOpenSections] = useState({
        categories: true, // Categorie aperte di default
        filters: true     // Filtri aperti di default
    });

    const toggleSection = (section: 'categories' | 'filters') => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // STATI DATI
    const [templates, setTemplates] = useState<MemeTemplate[]>([]);
    const [selectedMeme, setSelectedMeme] = useState<MemeTemplate | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("All"); // "All", "Trending", "New" oppure il nome di un tag
    const [showDashboard, setShowDashboard] = useState(false);

    useEffect(() => {
        fetch('/api/templates/')
            .then((res) => res.json())
            .then((data) => setTemplates(data))
            .catch((err) => console.error("Errore fetch:", err));
    }, []);

    // Estrarre Tag Unici dai template caricati per il filtro "By Tag"
    // (In un'app reale faresti una fetch dedicata /api/tags/)
    const uniqueTags = Array.from(new Set(
        templates.flatMap(t => t.tags.map(tag => tag.name))
    )).slice(0, 10); // Limitiamo a 10 tag

    const handleDelete = async (id: number) => {
        if (!window.confirm("Sei sicuro di voler eliminare questo meme?")) return;
        try {
            const response = await fetch(`/api/templates/${id}/`, { method: 'DELETE' });
            if (response.ok) setTemplates(prev => prev.filter(t => t.id !== id));
        } catch (error) { console.error(error); }
    };

    const filteredTemplates = templates.filter((meme) => {
        const searchLower = searchTerm.toLowerCase();
        
        // Filtro di ricerca testuale
        const matchesSearch = meme.title.toLowerCase().includes(searchLower) || 
                              meme.tags.some(tag => tag.name.toLowerCase().includes(searchLower));

        // Filtro Sidebar (Categorie o Tag)
        let matchesCategory = true;
        if (activeFilter === 'Trending') {
            matchesCategory = true; // Logica trending qui (es. views > 100)
        } else if (activeFilter === 'New') {
            matchesCategory = true; // Logica new qui (es. data recente)
        } else if (activeFilter !== 'All') {
            // Se non è una categoria standard, consideralo un TAG
            matchesCategory = meme.tags.some(t => t.name === activeFilter);
        }

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="app-wrapper">
            
            <header className="app-header fixed-header">
                <div className="logo-area" style={{ width: isSidebarExpanded ? '240px' : '60px', transition: 'width 0.3s' }}>
                    <i className="bi bi-planet" style={{fontSize: '1.5rem', color: '#aadaff'}}></i>
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
                
                {/* --- SIDEBAR --- */}
                <aside className={`app-sidebar ${isSidebarExpanded ? '' : 'collapsed'}`}>
                    
                    {/* Header interno (Hamburger) */}
                    <div className="sidebar-header-internal">
                        <button 
                            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)} 
                            className="btn-hamburger sidebar-trigger"
                        >
                            <i className="bi bi-list"></i>
                        </button>
                    </div>

                    <div className="sidebar-scroll-content">
                        
                        {/* 1. GRUPPO CATEGORIES (Dropdown) */}
                        <div className="nav-group">
                            {/* Titolo Cliccabile (Solo se espanso) */}
                            {isSidebarExpanded && (
                                <div className="nav-group-header" onClick={() => toggleSection('categories')}>
                                    <span>CATEGORIES</span>
                                    <i className={`bi bi-chevron-down chevron ${openSections.categories ? 'rotate' : ''}`}></i>
                                </div>
                            )}

                            {/* Lista Elementi (Visibile se aperto O se la sidebar è slim per mostrare le icone) */}
                            {(openSections.categories || !isSidebarExpanded) && (
                                <ul className="filter-list slide-in">
                                    <li 
                                        className={`filter-item ${activeFilter === 'All' ? 'active' : ''}`} 
                                        onClick={() => setActiveFilter('All')}
                                        title="All Templates"
                                    >
                                        <i className="bi bi-grid-fill"></i> 
                                        {isSidebarExpanded && <span>All Templates</span>}
                                    </li>
                                    <li className={`filter-item ${activeFilter === 'Trending' ? 'active' : ''}`} onClick={() => setActiveFilter('Trending')} title="Trending">
                                        <i className="bi bi-fire"></i> 
                                        {isSidebarExpanded && <span>Trending</span>}
                                    </li>
                                    <li className={`filter-item ${activeFilter === 'New' ? 'active' : ''}`} onClick={() => setActiveFilter('New')} title="New">
                                        <i className="bi bi-stars"></i> 
                                        {isSidebarExpanded && <span>New</span>}
                                    </li>
                                </ul>
                            )}
                        </div>

                        {/* 2. GRUPPO FILTERS (By Tag) */}
                        <div className="nav-group">
                            {/* Titolo Cliccabile */}
                            {isSidebarExpanded && (
                                <div className="nav-group-header" onClick={() => toggleSection('filters')}>
                                    <span>FILTERS</span>
                                    <i className={`bi bi-chevron-down chevron ${openSections.filters ? 'rotate' : ''}`}></i>
                                </div>
                            )}

                            {/* Contenuto Filtri (Visibile solo se Sidebar è Espansa E Sezione aperta) */}
                            {isSidebarExpanded && openSections.filters && (
                                <div className="filter-content slide-in">
                                    <div style={{padding: '5px 15px 10px', fontSize: '0.85rem', color: '#888', fontWeight: 'bold'}}>
                                        <i className="bi bi-tags"></i> By Tag
                                    </div>
                                    
                                    <div className="tags-cloud-sidebar">
                                        {uniqueTags.length === 0 ? (
                                            <span style={{color: '#666', paddingLeft: '15px', fontSize: '0.8rem'}}>No tags yet.</span>
                                        ) : (
                                            uniqueTags.map(tag => (
                                                <div 
                                                    key={tag} 
                                                    className={`sidebar-tag ${activeFilter === tag ? 'active' : ''}`}
                                                    onClick={() => setActiveFilter(tag)}
                                                >
                                                    #{tag}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </aside>

                <main className={`main-content ${isSidebarExpanded ? '' : 'collapsed'}`}>
                    <div className="hero-section">
                        <h2>Explore the collection</h2>
                    </div>

                    <h3 style={{ marginBottom: '1rem', color: '#888', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Results ({filteredTemplates.length}) {activeFilter !== 'All' && <span>/ {activeFilter}</span>}
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
                            <p>No templates found for "{activeFilter}".</p>
                        </div>
                    )}
                </main>
            </div>

            <footer className="app-footer">
                <div className="footer-content">© 2026 Template Planet</div>
            </footer>

            {selectedMeme && <MemeModal template={selectedMeme} onClose={() => setSelectedMeme(null)} />}
            {showDashboard && user && <UserDashboard user={user} onClose={() => setShowDashboard(false)} />}
        </div>
    );
};