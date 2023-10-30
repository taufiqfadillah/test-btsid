import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(Cookies.get('token') || null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get('token'));

  useEffect(() => {
    if (authToken) {
      Cookies.set('token', authToken, { expires: 7, secure: true });
    } else {
      Cookies.remove('token');
    }
  }, [authToken]);

  return <AuthContext.Provider value={{ authToken, setAuthToken, isLoggedIn, setIsLoggedIn }}>{children}</AuthContext.Provider>;
};
