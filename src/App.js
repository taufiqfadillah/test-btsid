import React from 'react';
import ChecklistApp from './Checklist';
import ChecklistItem from './ChecklistItem';
import Auth from './Auth';
import { AuthContext } from './AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const { isLoggedIn, setIsLoggedIn } = React.useContext(AuthContext);

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ paddingBottom: '50px' }}>Checklist App BTSID</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem' }}>
          <Routes>
            <Route path="/" element={isLoggedIn ? <ChecklistApp /> : <Auth />} />
            {isLoggedIn && <Route path="/checklist" element={<ChecklistApp />} />}
          </Routes>
          {isLoggedIn && <ChecklistItem />}
          {isLoggedIn && (
            <button onClick={handleLogout} style={{ position: 'absolute', top: '15px', right: '15px' }}>
              Logout
            </button>
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;
