import React from 'react';
import { AppHeader } from '@/components/AppHeader';
import { AppFooter } from '@/components/AppFooter';

export const AppLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <AppHeader />
            <main className="flex-1">{children}</main>
            <AppFooter />
        </div>
    );
};
