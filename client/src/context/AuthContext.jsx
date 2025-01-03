import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios'; // עליך לוודא ש-axios מותקן

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  // הפעלת useEffect כל פעם שה-token משתנה
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          // שליחה של בקשה לשרת עם ה-token שנמצא ב-localStorage
          const response = await axios.get('/user/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data.user); // עדכון המשתמש מה-API
        } catch (error) {
          console.error('Error fetching user:', error);
          setUser(null); // במידה ויש טעות, נדאג להחזיר את המשתמש ל-null
        }
      }
    };

    fetchUser();
  }, [token]); // יש להריץ את ה-useEffect כאשר ה-token משתנה

  const login = (userData, token) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem('token', token); // שמירה ב-localStorage
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('token'); // מחיקת ה-token מ-localStorage
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
