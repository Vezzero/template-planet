import { useState, useEffect } from 'react';
import type { MemeTemplate } from '../types';
import { MemeCard } from '../components/MemeCard';
import { MemeModal } from '../components/MemeModal';
import '../App.css';

interface LandingPageProps {
    onNavigateToUpload: () => void;
    onNavigateToAdmin: () => void;
}

export const LandingPage = ({ onNavigateToUpload, onNavigateToAdmin }: LandingPageProps) => {
  const [templates, setTemplates] = useState<MemeTemplate[]>([]);
  const [selectedMeme, setSelectedMeme] = useState<MemeTemplate | null>(null);
  
  // 1. STATI PER FILTRI E RICERCA
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tutti");

  useEffect(() => {
    fetch('/api/templates/')
      .then((res) => res.json())
      .then((data) => setTemplates(data))
      .catch((err) => console.error("Errore fetch:", err));
  }, []);

  const filteredTemplates = templates.filter((meme) => {
    const searchLower = searchTerm.toLowerCase();
    
    // Cerca nel titolo
    const matchTitle = meme.title.toLowerCase().includes(searchLower);
    
    const matchTags = meme.tags.some(tag => tag.name.toLowerCase().includes(searchLower));

    // Se uno dei due è vero, mostra il meme
    return matchTitle || matchTags;
  });


  return (
    <div className="app-wrapper">
      <header className="app-header">
        <div className="logo">Template Planet 🪐</div>
        <nav className="main-nav">
          <a href="#" onClick={(e) => e.preventDefault()}>Blog</a>
          {/* 3. Collega il bottone alla funzione */}
          <a href="#" className="nav-btn-upload" onClick={onNavigateToUpload}>
            Carica Meme
          </a>
        </nav>
      </header>

      {/* CONTENITORE LAYOUT (Sidebar + Main) */}
      <div className="layout-container">
        
        {/* SIDEBAR SINISTRA */}
        <aside className="app-sidebar">
          <div className="filter-group">
            <h3>Categorie</h3>
            <ul className="filter-list">
              <li 
                className={`filter-item ${activeFilter === 'Tutti' ? 'active' : ''}`}
                onClick={() => setActiveFilter('Tutti')}
              >
                🏠 Tutti i Template
              </li>
              <li className="filter-item">🔥 Trending</li>
              <li className="filter-item">✨ Nuovi Arrivi</li>
              <li className="filter-item">🐱 Animali</li>
              <li className="filter-item">🎬 Cinema/TV</li>
            </ul>
          </div>

          <div className="filter-group">
            <h3>Formato</h3>
            <ul className="filter-list">
              <li className="filter-item">Quadrato (1:1)</li>
              <li className="filter-item">Verticale (Story)</li>
            </ul>
          </div>
        </aside>

        {/* CONTENUTO CENTRALE */}
        <main className="main-content">
          <div className="hero-section">
            <h2>Esplora la collezione</h2>
            <p>Cerca il template perfetto per il tuo prossimo meme virale.</p>
          </div>

          {/* BARRA DI RICERCA */}
          <div className="search-container">
            <input 
              type="text" 
              placeholder="🔍 Cerca template (es. gatto, batman...)" 
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* RISULTATI (Scroll Orizzontale) */}
          <h3 style={{ marginBottom: '1rem', color: '#888' }}>
            Risultati ({filteredTemplates.length})
          </h3>

          {filteredTemplates.length === 0 ? (
            <p className="loading-text">Nessun meme trovato con questo nome.</p>
          ) : (
            <div className="meme-scroll-container">
              {filteredTemplates.map((meme) => (
                <MemeCard 
                  key={meme.id} 
                  template={meme} 
                  onClick={setSelectedMeme} 
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* FOOTER */}
      <footer className="app-footer">
    {/* ... */}
    <div className="footer-links">
        <a href="#" onClick={onNavigateToAdmin}>Admin Login</a> {/* Link Temporaneo */}
    </div>
</footer>

      {/* MODALE */}
      {selectedMeme && (
        <MemeModal 
            template={selectedMeme} 
            onClose={() => setSelectedMeme(null)} 
        />
      )}
    </div>
  );
};