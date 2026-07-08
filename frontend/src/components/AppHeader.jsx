import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { HEADER } from '@/constants/testIds';
import { api } from '@/lib/api';
import {
    LOGO_KAB_ROHIL,
    LOGO_INSPEKTORAT,
    GOVERNMENT_NAME,
    INSTITUTION_FULL_NAME,
    PORTAL_NAME,
    INSTITUTION_TAGLINE,
    CONTACT_PHONE,
    CONTACT_EMAIL,
    APP_MENU,
} from '@/lib/branding';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
    Phone, Mail, LogOut, Shield, User as UserIcon, LayoutDashboard, ChevronDown,
    LayoutGrid, Newspaper, Menu as MenuIcon, X, ExternalLink, Clock,
} from 'lucide-react';
import { toast } from 'sonner';

const formatDateID = (d) => {
    try {
        return d.toLocaleDateString('id-ID', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
        });
    } catch { return ''; }
};

// -------------- Top strip (green) --------------
const TopStrip = () => {
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 30_000);
        return () => clearInterval(t);
    }, []);
    return (
        <div className="bg-[#0e6b3f] text-white text-xs">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                    <a href={`tel:${CONTACT_PHONE.replace(/\s+/g, '')}`} className="inline-flex items-center gap-1.5 hover:underline">
                        <Phone className="h-3.5 w-3.5" /> {CONTACT_PHONE}
                    </a>
                    <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-1.5 hover:underline">
                        <Mail className="h-3.5 w-3.5" /> {CONTACT_EMAIL}
                    </a>
                </div>
                <div className="hidden md:inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{formatDateID(now)}</span>
                </div>
            </div>
        </div>
    );
};

// -------------- Institutional header (white) --------------
const InstitutionalHeader = ({ onMobileMenuToggle, mobileMenuOpen }) => (
    <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
            <Link
                to="/dashboard"
                data-testid={HEADER.dashboardLink}
                className="flex items-center gap-4 flex-1 hover:opacity-90 transition-opacity"
            >
                <img src={LOGO_KAB_ROHIL} alt="Logo Kabupaten Rokan Hilir" className="h-14 sm:h-16 w-auto object-contain" />
                <img src={LOGO_INSPEKTORAT} alt="Logo Inspektorat Kabupaten Rokan Hilir" className="h-14 sm:h-16 w-auto object-contain" />
                <div className="leading-tight">
                    <div className="font-heading text-[13px] sm:text-sm font-semibold tracking-wide text-[#0e6b3f] uppercase">
                        {GOVERNMENT_NAME}
                    </div>
                    <div className="font-heading text-lg sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 uppercase">
                        {INSTITUTION_FULL_NAME}
                    </div>
                    <div className="text-[11px] sm:text-xs text-slate-500 italic">
                        {PORTAL_NAME} · {INSTITUTION_TAGLINE}
                    </div>
                </div>
            </Link>
            <button
                type="button"
                className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-md border border-slate-200 text-slate-700"
                onClick={onMobileMenuToggle}
                aria-label="Buka menu"
            >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
        </div>
    </div>
);

// -------------- Green nav bar --------------
const NAV_LINK_CLS = ({ isActive }) => [
    'inline-flex items-center gap-2 px-3.5 py-3 text-sm font-medium transition-colors border-b-2',
    isActive
        ? 'text-white border-[#f5c451] bg-[#075a34]'
        : 'text-white/90 border-transparent hover:bg-[#075a34] hover:text-white',
].join(' ');

const MOBILE_LINK_CLS = ({ isActive }) => [
    'block px-4 py-3 text-sm font-medium transition-colors',
    isActive ? 'bg-[#075a34] text-white' : 'text-white/90 hover:bg-[#075a34]',
].join(' ');

const GreenNavBar = ({ user, links, onLogout, mobileMenuOpen, closeMobileMenu, onProfile }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isAdminSection = location.pathname.startsWith('/admin');

    const openApp = (key) => {
        const url = links?.[key];
        const item = APP_MENU.find((m) => m.key === key);
        if (!item?.active || !url) {
            toast.info('Aplikasi ini sedang dipersiapkan.');
            return;
        }
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <nav className="bg-[#0e6b3f] shadow-sm relative">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                {/* Desktop nav */}
                <div className="hidden lg:flex items-center gap-0">
                    <NavLink to="/dashboard" end className={NAV_LINK_CLS} data-testid="nav-beranda">
                        <LayoutDashboard className="h-4 w-4" /> Beranda
                    </NavLink>

                    {/* Menu Aplikasi dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                className={[
                                    'inline-flex items-center gap-2 px-3.5 py-3 text-sm font-medium transition-colors border-b-2 border-transparent',
                                    'text-white/90 hover:bg-[#075a34] hover:text-white',
                                ].join(' ')}
                                data-testid="nav-menu-aplikasi"
                            >
                                <LayoutGrid className="h-4 w-4" /> Menu Aplikasi
                                <ChevronDown className="h-3.5 w-3.5" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-64">
                            <DropdownMenuLabel>Aplikasi E-Arsip</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {APP_MENU.map((m) => (
                                <DropdownMenuItem
                                    key={m.key}
                                    onClick={() => openApp(m.key)}
                                    className="flex items-center justify-between"
                                    data-testid={`nav-app-${m.key}`}
                                >
                                    <span className="text-sm">{m.title}</span>
                                    {m.active ? (
                                        <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 text-[10px]">Aktif</Badge>
                                    ) : (
                                        <Badge className="bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 text-[10px]">Soon</Badge>
                                    )}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <a
                        href="/dashboard#pengumuman"
                        onClick={(e) => { e.preventDefault(); if (location.pathname !== '/dashboard') navigate('/dashboard'); setTimeout(() => document.getElementById('pengumuman')?.scrollIntoView({ behavior: 'smooth' }), 150); }}
                        className="inline-flex items-center gap-2 px-3.5 py-3 text-sm font-medium text-white/90 hover:bg-[#075a34] hover:text-white border-b-2 border-transparent"
                        data-testid="nav-pengumuman"
                    >
                        <Newspaper className="h-4 w-4" /> Pengumuman
                    </a>

                    {user?.role === 'admin' && (
                        <NavLink
                            to="/admin/users"
                            className={() => [
                                'inline-flex items-center gap-2 px-3.5 py-3 text-sm font-medium transition-colors border-b-2',
                                isAdminSection ? 'text-white border-[#f5c451] bg-[#075a34]' : 'text-white/90 border-transparent hover:bg-[#075a34] hover:text-white',
                            ].join(' ')}
                            data-testid={HEADER.adminLink}
                        >
                            <Shield className="h-4 w-4" /> Panel Admin
                        </NavLink>
                    )}
                </div>

                {/* User area */}
                <div className="hidden lg:flex items-center gap-2 py-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                data-testid={HEADER.userMenuTrigger}
                                className="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 px-3 py-1.5 text-sm text-white transition-colors"
                            >
                                <div className="h-7 w-7 rounded-full bg-white text-[#0e6b3f] flex items-center justify-center text-xs font-semibold">
                                    {(user?.full_name || user?.username || '?').slice(0, 1).toUpperCase()}
                                </div>
                                <span className="max-w-[140px] truncate">{user?.full_name || user?.username}</span>
                                <ChevronDown className="h-4 w-4" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">{user?.full_name}</span>
                                    <span className="text-xs text-muted-foreground">@{user?.username}</span>
                                    <Badge variant="secondary" className="mt-2 w-fit text-[10px] uppercase tracking-wide">
                                        {user?.role}
                                    </Badge>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                                <LayoutDashboard className="h-4 w-4 mr-2" /> Beranda
                            </DropdownMenuItem>
                            {user?.role === 'admin' && (
                                <DropdownMenuItem onClick={() => navigate('/admin/users')}>
                                    <Shield className="h-4 w-4 mr-2" /> Panel Admin
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={onProfile} data-testid={HEADER.profileLink}>
                                <UserIcon className="h-4 w-4 mr-2" /> Profil & Kata Sandi
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={onLogout}
                                data-testid={HEADER.logoutButton}
                                className="text-destructive focus:text-destructive"
                            >
                                <LogOut className="h-4 w-4 mr-2" /> Keluar
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Mobile menu panel */}
            {mobileMenuOpen && (
                <div className="lg:hidden bg-[#0e6b3f] border-t border-white/10">
                    <div className="py-2">
                        <NavLink to="/dashboard" end className={MOBILE_LINK_CLS} onClick={closeMobileMenu}>
                            <span className="inline-flex items-center gap-2"><LayoutDashboard className="h-4 w-4" /> Beranda</span>
                        </NavLink>
                        <div className="px-4 pt-3 pb-1 text-[11px] uppercase tracking-wide text-white/60">Menu Aplikasi</div>
                        {APP_MENU.map((m) => (
                            <button
                                key={m.key}
                                type="button"
                                onClick={() => { openApp(m.key); closeMobileMenu(); }}
                                className="w-full text-left px-4 py-2.5 text-sm text-white/90 hover:bg-[#075a34] flex items-center justify-between"
                            >
                                <span className="inline-flex items-center gap-2"><ExternalLink className="h-3.5 w-3.5" /> {m.title}</span>
                                {m.active
                                    ? <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 rounded px-1.5 py-0.5">Aktif</span>
                                    : <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 rounded px-1.5 py-0.5">Soon</span>}
                            </button>
                        ))}
                        <button
                            type="button"
                            onClick={() => {
                                closeMobileMenu();
                                if (location.pathname !== '/dashboard') navigate('/dashboard');
                                setTimeout(() => document.getElementById('pengumuman')?.scrollIntoView({ behavior: 'smooth' }), 200);
                            }}
                            className="w-full text-left px-4 py-3 text-sm text-white/90 hover:bg-[#075a34]"
                        >
                            <span className="inline-flex items-center gap-2"><Newspaper className="h-4 w-4" /> Pengumuman</span>
                        </button>
                        {user?.role === 'admin' && (
                            <NavLink to="/admin/users" className={MOBILE_LINK_CLS} onClick={closeMobileMenu}>
                                <span className="inline-flex items-center gap-2"><Shield className="h-4 w-4" /> Panel Admin</span>
                            </NavLink>
                        )}
                        <div className="border-t border-white/10 my-2" />
                        <button type="button" onClick={() => { closeMobileMenu(); onProfile(); }} className="w-full text-left px-4 py-3 text-sm text-white/90 hover:bg-[#075a34]">
                            <span className="inline-flex items-center gap-2"><UserIcon className="h-4 w-4" /> Profil & Kata Sandi</span>
                        </button>
                        <button type="button" onClick={() => { closeMobileMenu(); onLogout(); }} className="w-full text-left px-4 py-3 text-sm text-white/90 hover:bg-[#075a34]">
                            <span className="inline-flex items-center gap-2"><LogOut className="h-4 w-4" /> Keluar</span>
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

// -------------- Main exported header --------------
export const AppHeader = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [links, setLinks] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        let mounted = true;
        api.get('/links').then(({ data }) => { if (mounted) setLinks(data); }).catch(() => {});
        return () => { mounted = false; };
    }, []);

    const handleLogout = () => {
        logout();
        toast.success('Anda telah keluar dari portal.');
        navigate('/login', { replace: true });
    };

    return (
        <header className="sticky top-0 z-40 shadow-sm">
            <TopStrip />
            <InstitutionalHeader
                mobileMenuOpen={mobileMenuOpen}
                onMobileMenuToggle={() => setMobileMenuOpen((s) => !s)}
            />
            <GreenNavBar
                user={user}
                links={links}
                onLogout={handleLogout}
                onProfile={() => navigate('/profile')}
                mobileMenuOpen={mobileMenuOpen}
                closeMobileMenu={() => setMobileMenuOpen(false)}
            />
            <div className="h-1 bg-gradient-to-r from-[#0e6b3f] via-[#f5c451] to-[#0e6b3f]" />
        </header>
    );
};
