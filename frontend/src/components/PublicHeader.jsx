import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Clock, Home, LogIn, Mail, Menu, Newspaper, Phone, X, ExternalLink, Sparkles, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    CONTACT_EMAIL, CONTACT_PHONE, GOVERNMENT_NAME, INSTITUTION_FULL_NAME,
    INSTITUTION_TAGLINE, LOGO_INSPEKTORAT, LOGO_KAB_ROHIL, PORTAL_NAME, KKA_URL,
} from '@/lib/branding';

const desktopLink = ({ isActive }) => `inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${isActive ? 'border-[#f5c451] bg-[#075a34] text-white' : 'border-transparent text-white/90 hover:bg-[#075a34] hover:text-white'}`;
const mobileLink = ({ isActive }) => `flex items-center gap-2 px-4 py-3 text-sm font-semibold ${isActive ? 'bg-[#075a34] text-white' : 'text-white/90 hover:bg-[#075a34]'}`;

export const PublicHeader = () => {
    const [open, setOpen] = useState(false);
    const [now, setNow] = useState(new Date());
    const location = useLocation();

    useEffect(() => { const timer = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(timer); }, []);
    useEffect(() => setOpen(false), [location.pathname]);

    return (
        <header className="sticky top-0 z-50 shadow-sm">
            <div className="bg-[#075a34] text-xs text-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap items-center gap-4">
                        <a href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`} className="inline-flex items-center gap-1.5 hover:underline">
                            <Phone className="h-3.5 w-3.5" />{CONTACT_PHONE}
                        </a>
                        <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-1.5 hover:underline">
                            <Mail className="h-3.5 w-3.5" />{CONTACT_EMAIL}
                        </a>
                    </div>
                    <span className="hidden items-center gap-1.5 md:inline-flex">
                        <Clock className="h-3.5 w-3.5" />{now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                </div>
            </div>
            <div className="bg-white">
                <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
                    <Link to="/" className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                        <img src={LOGO_KAB_ROHIL} alt="Logo Kabupaten Rokan Hilir" className="h-14 w-auto object-contain sm:h-16" />
                        <img src={LOGO_INSPEKTORAT} alt="Logo Inspektorat" className="hidden h-14 w-auto object-contain sm:block sm:h-16" />
                        <div className="min-w-0 leading-tight">
                            <p className="truncate text-[11px] font-bold uppercase tracking-wider text-emerald-700 sm:text-sm">{GOVERNMENT_NAME}</p>
                            <p className="font-heading text-lg font-bold uppercase text-slate-900 sm:text-2xl lg:text-3xl">{INSTITUTION_FULL_NAME}</p>
                            <p className="hidden text-xs italic text-slate-500 sm:block">{PORTAL_NAME} · {INSTITUTION_TAGLINE}</p>
                        </div>
                    </Link>
                    <button type="button" onClick={() => setOpen((value) => !value)} className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-700 lg:hidden" aria-label="Buka menu">
                        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>
            <nav className="relative bg-[#0e6b3f]">
                <div className="mx-auto hidden max-w-7xl items-center justify-between px-4 sm:px-6 lg:flex lg:px-8">
                    <div className="flex items-center">
                        <NavLink to="/" end className={desktopLink}><Home className="h-4 w-4" />Beranda</NavLink>
                        <a href="/#layanan-apip" className="inline-flex items-center gap-2 border-b-2 border-transparent px-4 py-3 text-sm font-semibold text-white/90 hover:bg-[#075a34] hover:text-white transition">
                            <Layers className="h-4 w-4" />Layanan & Aplikasi APIP
                        </a>
                        <NavLink to="/berita" className={desktopLink}><Newspaper className="h-4 w-4" />Berita & Pengumuman</NavLink>
                    </div>
                    <div className="flex items-center gap-3">
                        <a
                            href={KKA_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg bg-[#f5c451] px-3.5 py-1.5 text-xs font-bold text-[#064027] shadow-sm hover:bg-[#ffd875] hover:shadow transition transform hover:-translate-y-0.5"
                        >
                            <Sparkles className="h-3.5 w-3.5 text-[#064027]" />
                            <span>KKA Digital</span>
                            <ExternalLink className="h-3 w-3 opacity-70" />
                        </a>
                        <Button asChild size="sm" className="bg-white font-semibold text-emerald-800 hover:bg-emerald-50">
                            <Link to="/login"><LogIn className="mr-2 h-4 w-4" />Login Portal Internal</Link>
                        </Button>
                    </div>
                </div>
                {open && (
                    <div className="border-t border-white/10 lg:hidden divide-y divide-white/10">
                        <NavLink to="/" end className={mobileLink}><Home className="h-4 w-4" />Beranda</NavLink>
                        <a href="/#layanan-apip" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-white/90 hover:bg-[#075a34]">
                            <Layers className="h-4 w-4" />Layanan & Aplikasi APIP
                        </a>
                        <NavLink to="/berita" className={mobileLink}><Newspaper className="h-4 w-4" />Berita & Pengumuman</NavLink>
                        <div className="p-3 bg-[#063b25] flex flex-col gap-2">
                            <a
                                href={KKA_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 rounded-lg bg-[#f5c451] px-4 py-2.5 text-sm font-bold text-[#064027] shadow"
                            >
                                <Sparkles className="h-4 w-4" />
                                <span>Buka KKA Digital</span>
                                <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                            <Link to="/login" className="flex items-center justify-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20">
                                <LogIn className="h-4 w-4" />Login Portal Internal
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
            <div className="h-1 bg-gradient-to-r from-emerald-800 via-[#f5c451] to-emerald-800" />
        </header>
    );
};

