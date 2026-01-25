import { useState } from 'react';
import './App.css';
import { LandingPage } from './pages/LandingPage';
import { UploadPage } from './pages/UploadPage';

function App() {
  // Stato per decidere quale pagina mostrare: 'home' o 'upload'
  const [currentPage, setCurrentPage] = useState<'home' | 'upload'>('home');

  return (
    <>
      {currentPage === 'home' && (
        <LandingPage onNavigateToUpload={() => setCurrentPage('upload')} />
      )}
      
      {currentPage === 'upload' && (
        <UploadPage onBack={() => setCurrentPage('home')} />
      )}
    </>
  );
}

export default App;