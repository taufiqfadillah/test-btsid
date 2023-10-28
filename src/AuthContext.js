import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      setAuthToken(token);
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (authToken) {
      Cookies.set('token', authToken, { expires: 7, secure: true });
    } else {
      Cookies.remove('token');
    }
  }, [authToken]);

  return <AuthContext.Provider value={{ authToken, setAuthToken, isLoggedIn, setIsLoggedIn }}>{children}</AuthContext.Provider>;
};
