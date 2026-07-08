import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, getToken, setToken, extractErrorMessage } from '@/lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshMe = useCallback(async () => {
        const token = getToken();
        if (!token) {
            setUser(null);
            setLoading(false);
            return null;
        }
        try {
            const { data } = await api.get('/auth/me');
            setUser(data);
            return data;
        } catch (e) {
            setToken(null);
            setUser(null);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshMe();
    }, [refreshMe]);

    const login = async (username, password) => {
        try {
            const { data } = await api.post('/auth/login', { username, password });
            setToken(data.access_token);
            setUser(data.user);
            return { ok: true, user: data.user };
        } catch (e) {
            return { ok: false, error: extractErrorMessage(e, 'Login gagal.') };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
    };

    const value = { user, loading, login, logout, refreshMe };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
};
