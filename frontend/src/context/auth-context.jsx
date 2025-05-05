import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAccessToken, clearAccessToken } from '@/utils/token-handler';
import useFetch from '../hooks/useFetch';

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
    const [accessToken, setAccessTokenState] = useState(getAccessToken());
    const [user, setUser] = useState(null); // can be fetched from /me or decoded from token
    const { fetchData } = useFetch();
    const isAuthenticated = !!accessToken;

    const login = (userData = null) => {
        if (userData) setUser(userData);
    };

    const logout = () => {
        clearAccessToken();
        setAccessTokenState(null);
        setUser(null);
    };

    useEffect(() => {
        const token = getAccessToken();
        if (token) {
            setAccessTokenState(token);
            // Fetch User profile from API or decode token to get user info
            (async () => {
                const userData = await fetchData("fetchProfile");
                if (userData) {
                    setUser(userData);
                }
            })();
        }
    }, []);

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
