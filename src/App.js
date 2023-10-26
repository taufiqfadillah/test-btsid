import React, { useState } from 'react';
import ChecklistApp from './Checklist';
import Auth from './Auth';
import { AuthProvider } from './AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <AuthProvider>
      <Router>
        <div style={{ textAlign: 'center' }}>
          <Routes>
            <Route path="/" element={isLoggedIn ? <ChecklistApp /> : <Auth onLogin={handleLogin} />} />
            <Route path="/checklist" element={<ChecklistApp />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
