import { useState, useEffect } from 'react';
import './App.css';
import type { MemeTemplate } from './types';
import { MemeCard } from './components/MemeCard';
import { MemeModal } from './components/MemeModal';

function App() {
  const [templates, setTemplates] = useState<MemeTemplate[]>([]);
  const [selectedMeme, setSelectedMeme] = useState<MemeTemplate | null>(null);

  useEffect(() => {
    // CHIAMATA REALE AL BACKEND
    fetch('/api/templates/')
      .then((res) => res.json())
      .then((data) => {
        // Django a volte restituisce l'URL relativo o assoluto, gestiamo entrambi i casi se serve.
        // Ma grazie al proxy di Vite, dovrebbe funzionare direttamente.
        setTemplates(data);
      })
      .catch((err) => console.error("Errore fetch:", err));
  }, []);

  return (
    <div className="container">
      <h1>Template Planet 🪐</h1>
      
      {templates.length === 0 ? (
        <p>Caricamento meme dal database...</p>
      ) : (
        <div className="meme-grid">
          {templates.map((meme) => (
            <MemeCard 
              key={meme.id} 
              template={meme} 
              onClick={setSelectedMeme} 
            />
          ))}
        </div>
      )}

      {selectedMeme && (
        <MemeModal 
            template={selectedMeme} 
            onClose={() => setSelectedMeme(null)} 
        />
      )}
    </div>
  );
}

export default App;