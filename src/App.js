import React from 'react';
import ChecklistApp from './Checklist';
import ChecklistItem from './ChecklistItem';
import Auth from './Auth';
import { AuthContext } from './AuthContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const { isLoggedIn, setAuthToken, setIsLoggedIn } = React.useContext(AuthContext);

  const handleLogout = () => {
    setAuthToken(null);
    setIsLoggedIn(false);
    return <Navigate to="/auth" />;
  };

  return (
    <Router>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ paddingBottom: '50px' }}>Checklist App BTSID</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem' }}>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/"
              element={
                isLoggedIn ? (
                  <>
                    <ChecklistApp />
                    <ChecklistItem />
                  </>
                ) : (
                  <Navigate to="/auth" />
                )
              }
            />
          </Routes>
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
