import React, { useState } from 'react';
import ChecklistApp from './Checklist';
import ChecklistItem from './ChecklistItem';
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
          <h1 style={{ paddingBottom: '50px' }}>Checklist App BTSID</h1>
          <div style={{ display: 'flex', justifyContent: 'space-around', gap: '2rem' }}>
            <Routes>
              <Route path="/" element={isLoggedIn ? <ChecklistApp /> : <Auth onLogin={handleLogin} />} />
              {isLoggedIn && <Route path="/checklist" element={<ChecklistApp />} />}
            </Routes>
            {isLoggedIn && <ChecklistItem />}
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
