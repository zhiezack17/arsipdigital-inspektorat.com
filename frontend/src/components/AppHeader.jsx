import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { BrandLogos } from '@/components/BrandLogos';
import { Button } from '@/components/ui/button';
import { HEADER } from '@/constants/testIds';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, Shield, User as UserIcon, LayoutDashboard, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export const AppHeader = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        toast.success('Anda telah keluar dari portal.');
        navigate('/login', { replace: true });
    };

    const isAdminSection = location.pathname.startsWith('/admin');

    return (
        <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-3">
                <Link to="/dashboard" className="hover:opacity-90 transition-opacity" data-testid={HEADER.dashboardLink}>
                    <BrandLogos />
                </Link>

                <div className="flex items-center gap-2">
                    {user?.role === 'admin' && (
                        <Button
                            variant={isAdminSection ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => navigate('/admin/users')}
                            data-testid={HEADER.adminLink}
                            className="hidden sm:inline-flex"
                        >
                            <Shield className="h-4 w-4 mr-2" />
                            Panel Admin
                        </Button>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                data-testid={HEADER.userMenuTrigger}
                                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                                    {(user?.full_name || user?.username || '?').slice(0, 1).toUpperCase()}
                                </div>
                                <div className="flex flex-col items-start leading-tight">
                                    <span className="text-xs font-medium max-w-[140px] truncate">{user?.full_name || user?.username}</span>
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{user?.role}</span>
                                </div>
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">{user?.full_name}</span>
                                    <span className="text-xs text-muted-foreground">@{user?.username}</span>
                                    <Badge
                                        variant="secondary"
                                        className="mt-2 w-fit text-[10px] uppercase tracking-wide"
                                    >
                                        {user?.role}
                                    </Badge>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                                <LayoutDashboard className="h-4 w-4 mr-2" />
                                Dashboard
                            </DropdownMenuItem>
                            {user?.role === 'admin' && (
                                <DropdownMenuItem onClick={() => navigate('/admin/users')}>
                                    <Shield className="h-4 w-4 mr-2" />
                                    Panel Admin
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => navigate('/profile')} data-testid={HEADER.profileLink}>
                                <UserIcon className="h-4 w-4 mr-2" />
                                Profil & Kata Sandi
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={handleLogout}
                                data-testid={HEADER.logoutButton}
                                className="text-destructive focus:text-destructive"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Keluar
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="gold-divider" />
        </header>
    );
};
