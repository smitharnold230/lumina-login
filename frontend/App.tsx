import React, { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import SuccessPage from './components/SuccessPage';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <div className="min-h-screen w-full bg-dark-900 text-white selection:bg-brand-500 selection:text-white overflow-hidden">
      {isAuthenticated ? (
        <SuccessPage />
      ) : (
        <LoginScreen onAuthSuccess={handleAuthSuccess} />
      )}
    </div>
  );
};

export default App;