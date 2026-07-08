import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { Card } from '@/components/ui/card';
import { Users, Newspaper, BarChart3, Link2, Shield } from 'lucide-react';

const NAV = [
    { to: '/admin/users', label: 'Manajemen User', icon: Users, testId: 'admin-nav-users' },
    { to: '/admin/news', label: 'Manajemen Berita', icon: Newspaper, testId: 'admin-nav-news' },
    { to: '/admin/stats', label: 'Manajemen Statistik', icon: BarChart3, testId: 'admin-nav-stats' },
    { to: '/admin/links', label: 'URL Subdomain', icon: Link2, testId: 'admin-nav-links' },
];

export default function AdminLayout() {
    return (
        <AppLayout>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-foreground">
                        <Shield className="h-3.5 w-3.5 text-primary" /> Panel Admin
                    </div>
                    <h1 className="mt-3 font-heading text-2xl sm:text-3xl font-semibold">Pengelolaan Portal</h1>
                    <p className="text-sm text-muted-foreground mt-1">Kelola pengguna, berita, statistik, dan tautan subdomain.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
                    <aside>
                        <Card className="p-2">
                            <nav className="flex lg:flex-col overflow-x-auto">
                                {NAV.map(({ to, label, icon: Icon, testId }) => (
                                    <NavLink
                                        key={to}
                                        to={to}
                                        data-testid={testId}
                                        className={({ isActive }) =>
                                            [
                                                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                                                isActive ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-secondary',
                                            ].join(' ')
                                        }
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span>{label}</span>
                                    </NavLink>
                                ))}
                            </nav>
                        </Card>
                    </aside>

                    <section>
                        <Outlet />
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
