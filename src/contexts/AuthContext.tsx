// src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { message } from 'antd'; // For feedback

interface AuthUser {
    id: number;
    email: string;
    roles: string[];
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: AuthUser | null;
    token: string | null;
    login: (token: string, userData: AuthUser) => void;
    logout: () => void;
    isLoading: boolean; // To handle initial state loading
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Start loading initially
    const router = useRouter();

    // Effect to load auth state from localStorage on initial mount
    useEffect(() => {
        try {
            const storedToken = localStorage.getItem('authToken');
            const storedUser = localStorage.getItem('userInfo');

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
                setIsAuthenticated(true);
            }
        } catch (error) {
             console.error("Error loading auth state from localStorage:", error);
             // Clear potentially corrupted storage
             localStorage.removeItem('authToken');
             localStorage.removeItem('userInfo');
        } finally {
            setIsLoading(false); // Finished loading
        }
    }, []); // Empty dependency array ensures this runs only once on mount


    const login = (newToken: string, userData: AuthUser) => {
        try{
            localStorage.setItem('authToken', newToken);
            localStorage.setItem('userInfo', JSON.stringify(userData));
            setToken(newToken);
            setUser(userData);
            setIsAuthenticated(true);
             message.success(`Welcome back, ${userData.email}!`);
             router.push('/dashboard'); // Redirect after login
        } catch (error) {
             console.error("Error saving auth state to localStorage:", error);
             message.error("Failed to save login session. Please try again.");
             logout(); // Attempt to clear any partial state
        }
    };

    const logout = () => {
        message.loading({ content: 'Logging out...', key: 'logout' });
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
         setTimeout(() => {
            message.success({ content: 'Logged out.', key: 'logout', duration: 1 });
            router.push('/login'); // Redirect to login page
        }, 300);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};