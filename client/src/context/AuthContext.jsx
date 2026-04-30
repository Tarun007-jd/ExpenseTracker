import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            let isValid = false;
            if (token) {
                try {
                    const res = await api.get('/auth/me');
                    setUser(res.data.user);
                    isValid = true;
                } catch {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setToken(null);
                    setUser(null);
                }
            }

            // Auto-login bypass for development/deployment
            if (!isValid) {
                try {
                    const res = await api.post('/auth/login', { 
                        email: 'developer@example.com', 
                        password: 'bypass' 
                    });
                    const { token: newToken, user: userData } = res.data;
                    localStorage.setItem('token', newToken);
                    localStorage.setItem('user', JSON.stringify(userData));
                    setToken(newToken);
                    setUser(userData);
                } catch (err) {
                    console.error("Auto login bypass failed:", err);
                }
            }
            
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        const { token: newToken, user: userData } = res.data;
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
        return userData;
    };

    const signup = async (name, email, password) => {
        const res = await api.post('/auth/signup', { name, email, password });
        const { token: newToken, user: userData } = res.data;
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
        return userData;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, signup, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};
