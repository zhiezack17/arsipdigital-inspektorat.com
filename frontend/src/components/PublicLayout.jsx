import React from 'react';
import { PublicHeader } from '@/components/PublicHeader';
import { AppFooter } from '@/components/AppFooter';

export const PublicLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <PublicHeader />
            <main className="flex-1">{children}</main>
            <AppFooter />
        </div>
    );
};
