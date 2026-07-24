import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
    LOGO_KAB_ROHIL,
    LOGO_INSPEKTORAT,
    GOVERNMENT_NAME,
    INSTITUTION_FULL_NAME,
    PORTAL_NAME,
    INSTITUTION_TAGLINE,
    CONTACT_PHONE,
    CONTACT_EMAIL,
} from '@/lib/branding';
import { Button } from '@/components/ui/button';
import { Phone, Mail, Clock, LogIn, Home, Newspaper, Menu as MenuIcon, X } from 'lucide-react';

const formatDateID = (d) => {
    try {
        return d.toLocaleDateString('id-ID', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
        });
    } catch { return ''; }
};

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

export const PublicHeader = () => {
    const [now, setNow] = useState(new Date());
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 30_000);
        return () => clearInterval(t);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    return (
        <header className="sticky top-0 z-40 shadow-sm">
            {/* Top strip */}
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

            {/* Institutional header */}
            <div className="bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
                    <Link
                        to="/"
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
                        onClick={() => setMobileMenuOpen((s) => !s)}
                        aria-label="Buka menu"
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Nav bar */}
            <nav className="bg-[#0e6b3f] shadow-sm relative">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    {/* Desktop nav */}
                    <div className="hidden lg:flex items-center gap-0">
                        <NavLink to="/" end className={NAV_LINK_CLS} data-testid="public-nav-beranda">
                            <Home className="h-4 w-4" /> Beranda
                        </NavLink>
                        <NavLink to="/berita" className={NAV_LINK_CLS} data-testid="public-nav-berita">
                            <Newspaper className="h-4 w-4" /> Berita &amp; Pengumuman
                        </NavLink>
                    </div>

                    {/* Login CTA */}
                    <div className="hidden lg:flex items-center gap-2 py-2">
                        <Button asChild size="sm" className="bg-white text-[#0e6b3f] hover:bg-white/90 font-semibold">
                            <Link to="/login" data-testid="public-nav-login">
                                <LogIn className="h-4 w-4 mr-1.5" />
                                Login Portal Internal
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden bg-[#0e6b3f] border-t border-white/10">
                        <div className="py-2">
                            <NavLink to="/" end className={MOBILE_LINK_CLS}>
                                <span className="inline-flex items-center gap-2"><Home className="h-4 w-4" /> Beranda</span>
                            </NavLink>
                            <NavLink to="/berita" className={MOBILE_LINK_CLS}>
                                <span className="inline-flex items-center gap-2"><Newspaper className="h-4 w-4" /> Berita &amp; Pengumuman</span>
                            </NavLink>
                            <div className="border-t border-white/10 my-2" />
                            <Link
                                to="/login"
                                className="block px-4 py-3 text-sm font-medium text-white/90 hover:bg-[#075a34]"
                            >
                                <span className="inline-flex items-center gap-2"><LogIn className="h-4 w-4" /> Login Portal Internal</span>
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
            <div className="h-1 bg-gradient-to-r from-[#0e6b3f] via-[#f5c451] to-[#0e6b3f]" />
        </header>
    );
};
