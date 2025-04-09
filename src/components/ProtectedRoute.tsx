// src/components/ProtectedRoute.tsx (Create this file/folder)
'use client';

import React, { ReactNode, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Spin, Layout } from 'antd'; // For loading indicator

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Check authentication status *after* initial loading is complete
        if (!isLoading && !isAuthenticated) {
            router.push('/login?redirected=true'); // Redirect to login if not authenticated
        }
    }, [isAuthenticated, isLoading, router]); // Dependencies for the effect


    // While loading authentication state, show a spinner
    if (isLoading) {
        return (
             <Layout style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                 <Spin size="large" tip="Loading Session..." />
             </Layout>
        );
    }

    // If authenticated, render the children components (the actual page)
    // If not authenticated, the effect will trigger redirect, rendering null briefly is fine
    return isAuthenticated ? <>{children}</> : null;

};

export default ProtectedRoute;