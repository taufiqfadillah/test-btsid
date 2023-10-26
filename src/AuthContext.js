import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return <AuthContext.Provider value={{ authToken, setAuthToken, isLoggedIn, setIsLoggedIn }}>{children}</AuthContext.Provider>;
};
