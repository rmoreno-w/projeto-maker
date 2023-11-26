'use client';
import { AuthProvider } from '@/contexts/loginContext';
import queryClient from '@/services/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
    );
}
