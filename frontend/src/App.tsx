import { useState } from 'react';
import './App.css';
import { LandingPage } from './pages/LandingPage';
import { UploadPage } from './pages/UploadPage';
import { AdminPage } from './pages/AdminPage';

// Definiamo il tipo Utente
export interface User {
  username: string;
  is_staff: boolean;
}

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'upload' | 'admin'>('home');
  
  // STATO UTENTE: null = non loggato, Oggetto = loggato
  const [user, setUser] = useState<User | null>(null);

  // Funzione chiamata quando il login (finto) ha successo
  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home'); // Se esci, torna alla home
  };

  return (
    <>
      {currentPage === 'home' && (
        <LandingPage 
            user={user}  // Passiamo l'utente alla pagina
            onLogin={handleLogin} // Passiamo la funzione per loggarsi
            onLogout={handleLogout} // Passiamo la funzione per uscire
            onNavigateToUpload={() => setCurrentPage('upload')} 
            onNavigateToAdmin={() => setCurrentPage('admin')} 
        />
      )}
      
      {currentPage === 'upload' && (
        <UploadPage onBack={() => setCurrentPage('home')} user={user} />
      )}

      {currentPage === 'admin' && (
        <AdminPage onBack={() => setCurrentPage('home')} />
      )}
    </>
  );
}

export default App;