import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAccessToken, clearAccessToken } from '@/utils/token-handler';
import useFetch from '../hooks/useFetch';

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
    const [accessToken, setAccessTokenState] = useState(getAccessToken());
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
    const { fetchData } = useFetch();
    const isAuthenticated = !!accessToken;

    const login = (userData = null) => {
        if (userData) {
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
        } else if (accessToken && !user) {
            fetchProfile();
        }
    };

    const logout = () => {
        clearAccessToken();
        setAccessTokenState(null);
        localStorage.removeItem("user");
        setUser(null);
    };

    useEffect(() => {
        const shouldFetch = accessToken && !user;
        if (shouldFetch) {
            fetchProfile()
        }
    }, [accessToken, user]);

    const fetchProfile = async () => {
        const userData = await fetchData("fetchProfile");
        if (userData) {
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
        }
    };

    const value = {
        accessToken,
        isAuthenticated,
        user,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
