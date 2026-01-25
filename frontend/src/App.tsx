// frontend/src/App.tsx
import { useState } from 'react';
import './App.css';
import { LandingPage } from './pages/LandingPage';
import { UploadPage } from './pages/UploadPage';
import { AdminPage } from './pages/AdminPage'; // Importa la pagina

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'upload' | 'admin'>('home');

  return (
    <>
      {currentPage === 'home' && (
        <LandingPage 
            onNavigateToUpload={() => setCurrentPage('upload')} 
            onNavigateToAdmin={() => setCurrentPage('admin')} // Passiamo la prop (da aggiungere in LandingPage)
        />
      )}
      
      {currentPage === 'upload' && (
        <UploadPage onBack={() => setCurrentPage('home')} />
      )}

      {currentPage === 'admin' && (
        <AdminPage onBack={() => setCurrentPage('home')} />
      )}
    </>
  );
}

export default App;