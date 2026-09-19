import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowRight, ArrowUpRight, CalendarDays, CheckCircle2, ChevronRight, Clock3, ExternalLink, FileText,
    Images, Layers, LogIn, Megaphone, Newspaper, ShieldCheck, Sparkles, Users,
} from 'lucide-react';
import { PublicLayout } from '@/components/PublicLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { publicApi } from '@/lib/api';
import { LOGO_KAB_ROHIL, KKA_URL, IRBAN_1_URL, IRBAN_4_URL } from '@/lib/branding';

const formatDate = (iso) => {
    if (!iso) return '';
    try {
        return new Date(iso).toLocaleDateString('id-ID', {
            day: '2-digit', month: 'long', year: 'numeric',
        });
    } catch {
        return iso;
    }
};

const excerpt = (value = '', max = 150) => {
    const clean = value.replace(/\s+/g, ' ').trim();
    return clean.length > max ? `${clean.slice(0, max).trim()}…` : clean;
};

const fadeUp = {
    hidden: { opacity: 0, y: 22 },
    visible: { opacity: 1, y: 0 },
};

const agenda = [
    { day: '05', month: 'AGU', title: 'Rapat koordinasi pengawasan internal', time: '09.00 WIB' },
    { day: '12', month: 'AGU', title: 'Evaluasi tindak lanjut hasil pemeriksaan', time: '08.30 WIB' },
    { day: '21', month: 'AGU', title: 'Sosialisasi pengelolaan arsip digital', time: '10.00 WIB' },
];

const gallery = [
    { title: 'Koordinasi Pengawasan', className: 'from-emerald-900 via-emerald-700 to-lime-500' },
    { title: 'Pembinaan Aparatur', className: 'from-slate-900 via-emerald-800 to-emerald-500' },
    { title: 'Evaluasi Tindak Lanjut', className: 'from-amber-700 via-emerald-800 to-emerald-950' },
    { title: 'Pelayanan Informasi', className: 'from-emerald-950 via-teal-700 to-amber-400' },
];

export default function PublicHomePage() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [heroIndex, setHeroIndex] = useState(0);

    useEffect(() => {
        publicApi.get('/public/news')
            .then(({ data }) => setNews(data || []))
            .catch(() => setNews([]))
            .finally(() => setLoading(false));
    }, []);

    const featured = useMemo(() => news.slice(0, 3), [news]);
    const latest = useMemo(() => news.slice(1, 7), [news]);
    const announcements = useMemo(
        () => news.filter((item) => (item.category || '').toLowerCase().includes('pengumuman')).slice(0, 4),
        [news],
    );

    useEffect(() => {
        if (featured.length < 2) return undefined;
        const timer = window.setInterval(() => {
            setHeroIndex((value) => (value + 1) % featured.length);
        }, 6500);
        return () => window.clearInterval(timer);
    }, [featured.length]);

    const hero = featured[heroIndex];

    return (
        <PublicLayout>
            <section className="relative isolate overflow-hidden bg-[#063b25] text-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(245,196,81,.28),transparent_35%),radial-gradient(circle_at_85%_60%,rgba(255,255,255,.14),transparent_32%)]" />
                <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'linear-gradient(120deg, transparent 0 55%, #fff 55% 55.5%, transparent 55.5%)' }} />
                <div className="relative mx-auto grid min-h-[520px] max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.25fr_.75fr] lg:px-8 lg:py-20">
                    <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: .65 }}>
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide backdrop-blur">
                            <ShieldCheck className="h-4 w-4 text-[#f5c451]" /> PORTAL RESMI & GERBANG LAYANAN DIGITAL APIP
                        </div>
                        <p className="mb-3 text-sm font-semibold uppercase tracking-[.2em] text-[#f5c451]">
                            Pemerintah Kabupaten Rokan Hilir
                        </p>
                        <h1 className="max-w-4xl font-heading text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                            Pusat Layanan Pengawasan & Kertas Kerja Audit Terpadu
                        </h1>
                        <p className="mt-6 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
                            Sistem Pengawasan Internal Terintegrasi Inspektorat Daerah Kabupaten Rokan Hilir. Akses cepat ke KKA Digital, E-Arsip Irban, dan transparansi pengawasan daerah.
                        </p>
                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            <a
                                href={KKA_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#f5c451] px-5 py-3 text-base font-bold text-[#064027] shadow-lg transition duration-200 hover:bg-[#ffd875] hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <Sparkles className="h-5 w-5 text-[#064027]" />
                                <span>Masuk ke KKA Digital</span>
                                <ExternalLink className="h-4 w-4 opacity-75" />
                            </a>
                            <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                                <a href="#layanan-apip">
                                    <Layers className="mr-2 h-5 w-5 text-[#f5c451]" /> Jelajahi Layanan APIP
                                </a>
                            </Button>
                            <Button asChild size="lg" variant="ghost" className="text-white/85 hover:bg-white/10 hover:text-white">
                                <Link to="/login"><LogIn className="mr-2 h-5 w-5" /> Portal Internal</Link>
                            </Button>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 25 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .7, delay: .15 }}>
                        <Card className="overflow-hidden border-white/15 bg-white/10 text-white shadow-2xl backdrop-blur-md">
                            <div className="relative min-h-[340px] p-7 sm:p-9">
                                <div className="absolute right-6 top-6 opacity-15">
                                    <img src={LOGO_KAB_ROHIL} alt="" className="h-36 w-36 object-contain" />
                                </div>
                                <Badge className="bg-[#f5c451] text-[#064027] hover:bg-[#f5c451]">Berita Utama</Badge>
                                {loading ? (
                                    <div className="mt-7 space-y-4"><Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-4/5" /><Skeleton className="h-20 w-full" /></div>
                                ) : hero ? (
                                    <div className="relative mt-7">
                                        <p className="mb-3 flex items-center gap-2 text-xs text-white/65"><CalendarDays className="h-4 w-4" /> {formatDate(hero.created_at)}</p>
                                        <h2 className="font-heading text-2xl font-bold leading-snug sm:text-3xl">{hero.title}</h2>
                                        <p className="mt-4 leading-7 text-white/75">{excerpt(hero.content, 210)}</p>
                                        <Link to={`/berita/${hero.slug}`} className="mt-6 inline-flex items-center gap-2 font-semibold text-[#f5c451]">Selengkapnya <ArrowRight className="h-4 w-4" /></Link>
                                    </div>
                                ) : (
                                    <div className="relative mt-7"><h2 className="font-heading text-3xl font-bold">Selamat Datang di Portal Inspektorat</h2><p className="mt-4 text-white/75">Informasi terbaru akan ditampilkan di bagian ini.</p></div>
                                )}
                                {featured.length > 1 && <div className="absolute bottom-6 left-7 flex gap-2">{featured.map((item, index) => <button key={item.id} aria-label={`Berita ${index + 1}`} onClick={() => setHeroIndex(index)} className={`h-2 rounded-full transition-all ${index === heroIndex ? 'w-8 bg-[#f5c451]' : 'w-2 bg-white/40'}`} />)}</div>}
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </section>

            <section className="border-b border-emerald-100 bg-emerald-50/70">
                <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 sm:px-6 lg:grid-cols-4 lg:px-8">
                    {[
                        [FileText, 'Arsip Digital', 'Tertata & mudah diakses'],
                        [ShieldCheck, 'Pengawasan', 'Akuntabel & profesional'],
                        [Users, 'Pelayanan', 'Terbuka untuk masyarakat'],
                        [Newspaper, 'Informasi', 'Aktual & terpercaya'],
                    ].map(([Icon, title, text]) => <div key={title} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm"><span className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700"><Icon className="h-5 w-5" /></span><div><p className="font-semibold text-slate-900">{title}</p><p className="text-xs text-slate-500">{text}</p></div></div>)}
                </div>
            </section>

            {/* Pintu Gerbang Layanan Digital Pengawasan (APIP) */}
            <section id="layanan-apip" className="scroll-mt-20 bg-gradient-to-b from-slate-50 via-white to-emerald-50/30 py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-800">
                            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                            <span>EKOSISTEM DIGITAL APIP 2026</span>
                        </div>
                        <h2 className="mt-3 font-heading text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                            Pintu Gerbang Layanan & Pengawasan Digital
                        </h2>
                        <p className="mt-3 text-base text-slate-600">
                            Portal terpadu Inspektorat Daerah Kabupaten Rokan Hilir untuk menghubungkan seluruh sistem pengawasan internal, audit desa terpadu, dan kearsipan modern.
                        </p>
                    </div>

                    {/* Flagship Spotlight: KKA Digital */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeUp}
                        className="relative overflow-hidden rounded-3xl border-2 border-emerald-500/30 bg-gradient-to-br from-[#063b25] via-[#094d30] to-[#073320] text-white shadow-2xl mb-12"
                    >
                        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-80 w-80 rounded-full bg-[#f5c451]/15 blur-3xl pointer-events-none" />
                        <div className="absolute left-1/3 bottom-0 -ml-16 -mb-16 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
                        
                        <div className="relative p-6 sm:p-10 lg:p-12">
                            <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2.5 mb-4">
                                        <Badge className="bg-[#f5c451] text-[#064027] font-bold text-xs uppercase px-3 py-1 shadow-sm">
                                            ⭐ Flagship Application 2026
                                        </Badge>
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-emerald-200 backdrop-blur">
                                            <ShieldCheck className="h-3.5 w-3.5 text-[#f5c451]" /> Standar SPKN & SAIPI
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
                                            v2.5 Enterprise Cloud
                                        </span>
                                    </div>

                                    <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
                                        KKA Digital — Kertas Kerja Audit Terpadu
                                    </h3>
                                    
                                    <p className="mt-4 text-base sm:text-lg text-emerald-100/90 leading-relaxed max-w-2xl">
                                        Platform otomasi pengawasan komprehensif bagi Auditor APIP Inspektorat Rohil. Mengintegrasikan seluruh siklus audit desa mulai dari pengujian fisik kas, penyusunan formulir temuan (KTP), penerbitan LHP otomatis berstandar baku, hingga pengawalan tindak lanjut (TLHP 60 Hari) dan sinkronisasi Google Drive.
                                    </p>

                                    {/* Feature Highlights Pills */}
                                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                        {[
                                            'Pemeriksaan Kas & Fisik (Opname Kas & Bank Otomatis)',
                                            'Kertas Kerja Temuan Pemeriksaan (KKTP / KTP)',
                                            'Penyusunan LHP Terstandar SPKN & SAIPI',
                                            'Monitoring Tindak Lanjut Rekomendasi 60 Hari',
                                            'Integrasi Cloud Storage & Google Drive Backup',
                                            'AI-Assisted Navigation & Manajemen Berita Acara',
                                        ].map((feature) => (
                                            <div key={feature} className="flex items-start gap-2 text-white/90">
                                                <CheckCircle2 className="h-4 w-4 text-[#f5c451] shrink-0 mt-0.5" />
                                                <span className="text-xs sm:text-sm font-medium">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 flex flex-wrap items-center gap-4">
                                        <a
                                            href={KKA_URL}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#f5c451] px-6 py-3.5 text-sm sm:text-base font-bold text-[#064027] shadow-xl transition transform hover:bg-[#ffd875] hover:-translate-y-0.5 active:translate-y-0"
                                        >
                                            <Sparkles className="h-5 w-5 text-[#064027]" />
                                            <span>Buka Sistem KKA Digital</span>
                                            <ArrowUpRight className="h-4 w-4 text-[#064027]" />
                                        </a>
                                        <span className="text-xs text-emerald-200/80">
                                            Link langsung: <code className="text-[#f5c451] font-mono">kka.arsipdigital-inspektorat.com</code>
                                        </span>
                                    </div>
                                </div>

                                {/* Interactive Showcase Box */}
                                <div className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-md">
                                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                        <div className="flex items-center gap-2.5">
                                            <div className="h-3 w-3 rounded-full bg-rose-400" />
                                            <div className="h-3 w-3 rounded-full bg-amber-400" />
                                            <div className="h-3 w-3 rounded-full bg-emerald-400" />
                                            <span className="ml-2 text-xs font-mono text-white/70">KKA-Digital-v2.5.sys</span>
                                        </div>
                                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px]">
                                            Production Ready
                                        </Badge>
                                    </div>
                                    <div className="mt-4 space-y-3 text-xs text-white/80">
                                        <div className="rounded-xl bg-black/20 p-3.5">
                                            <p className="font-semibold text-[#f5c451] flex items-center gap-1.5">
                                                <ShieldCheck className="h-4 w-4" /> Modul Audit Terpadu
                                            </p>
                                            <p className="mt-1 text-white/70 leading-relaxed">
                                                Sesi Pemeriksaan Kas, Rekapitulasi Fisik Kas Tunai & Bank, Master Template Pengawasan Desa se-Rohil.
                                            </p>
                                        </div>
                                        <div className="rounded-xl bg-black/20 p-3.5">
                                            <p className="font-semibold text-emerald-300 flex items-center gap-1.5">
                                                <FileText className="h-4 w-4" /> Otomasi Laporan & KTP
                                            </p>
                                            <p className="mt-1 text-white/70 leading-relaxed">
                                                Format baku KKTP, matriks temuan audit terstruktur, export BAP Kas & LHP instan.
                                            </p>
                                        </div>
                                        <div className="rounded-xl bg-black/20 p-3.5">
                                            <p className="font-semibold text-sky-300 flex items-center gap-1.5">
                                                <Clock3 className="h-4 w-4" /> Sistem Monitoring 60 Hari
                                            </p>
                                            <p className="mt-1 text-white/70 leading-relaxed">
                                                Tracking progres tindak lanjut kepenghuluan real-time sesuai batas ketentuan peraturan perundang-undangan.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Other Ecosystem Apps Grid */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <Card className="group relative overflow-hidden p-6 border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                            <div className="flex items-center justify-between">
                                <span className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
                                    <FileText className="h-6 w-6" />
                                </span>
                                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Aktif</Badge>
                            </div>
                            <h4 className="mt-4 font-heading text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition">
                                E-Arsip Irban I
                            </h4>
                            <p className="mt-2 text-xs leading-relaxed text-slate-600">
                                Sistem pengarsipan digital naskah dinas, PKPT, surat tugas, dan laporan hasil pengawasan Irban Wilayah I.
                            </p>
                            <div className="mt-5 pt-4 border-t border-slate-100">
                                <a
                                    href={IRBAN_1_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                                >
                                    Buka Aplikasi <ArrowUpRight className="h-3.5 w-3.5" />
                                </a>
                            </div>
                        </Card>

                        <Card className="group relative overflow-hidden p-6 border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                            <div className="flex items-center justify-between">
                                <span className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
                                    <FileText className="h-6 w-6" />
                                </span>
                                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Aktif</Badge>
                            </div>
                            <h4 className="mt-4 font-heading text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition">
                                E-Arsip Irban IV
                            </h4>
                            <p className="mt-2 text-xs leading-relaxed text-slate-600">
                                Tata kelola arsip digital pengawasan pemeriksaan, audit khusus, dan naskah dinas Irban Wilayah IV.
                            </p>
                            <div className="mt-5 pt-4 border-t border-slate-100">
                                <a
                                    href={IRBAN_4_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                                >
                                    Buka Aplikasi <ArrowUpRight className="h-3.5 w-3.5" />
                                </a>
                            </div>
                        </Card>

                        <Card className="group relative overflow-hidden p-6 border-dashed border-slate-300 bg-slate-50/50">
                            <div className="flex items-center justify-between">
                                <span className="rounded-xl bg-amber-100 p-3 text-amber-700">
                                    <Layers className="h-6 w-6" />
                                </span>
                                <Badge variant="outline" className="text-amber-700 border-amber-300 bg-amber-50">Tahap Integrasi</Badge>
                            </div>
                            <h4 className="mt-4 font-heading text-lg font-bold text-slate-800">
                                E-Arsip Irban II, III, & V
                            </h4>
                            <p className="mt-2 text-xs leading-relaxed text-slate-500">
                                Digitalisasi pengarsipan naskah pengawasan untuk Inspektur Pembantu Wilayah II, III, dan Wilayah V.
                            </p>
                            <div className="mt-5 pt-4 border-t border-slate-200/60">
                                <span className="text-xs text-slate-400 italic">Sedang dalam pengembangan</span>
                            </div>
                        </Card>

                        <Card className="group relative overflow-hidden p-6 border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                            <div className="flex items-center justify-between">
                                <span className="rounded-xl bg-sky-100 p-3 text-sky-700">
                                    <ShieldCheck className="h-6 w-6" />
                                </span>
                                <Badge className="bg-sky-50 text-sky-700 border-sky-200">Layanan Terpadu</Badge>
                            </div>
                            <h4 className="mt-4 font-heading text-lg font-bold text-slate-900 group-hover:text-sky-700 transition">
                                Si-Dumas & WBS Rohil
                            </h4>
                            <p className="mt-2 text-xs leading-relaxed text-slate-600">
                                Saluran pengaduan masyarakat, whistleblowing system, dan konsultasi pengawasan internal pemerintah daerah.
                            </p>
                            <div className="mt-5 pt-4 border-t border-slate-100">
                                <Link
                                    to="/berita"
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-800"
                                >
                                    Informasi Layanan <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
                    <div>
                        <div className="mb-7 flex items-end justify-between gap-4">
                            <div><p className="text-xs font-bold uppercase tracking-[.18em] text-emerald-700">Publikasi</p><h2 className="mt-2 font-heading text-3xl font-bold text-slate-900">Berita Terkini</h2></div>
                            <Button asChild variant="outline"><Link to="/berita">Semua Berita <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
                        </div>
                        <div className="grid gap-5 md:grid-cols-2">
                            {loading ? [1,2,3,4].map((i) => <Card key={i} className="p-6"><Skeleton className="h-5 w-24" /><Skeleton className="mt-4 h-7 w-full" /><Skeleton className="mt-3 h-16 w-full" /></Card>) : latest.slice(0, 4).map((item, index) => (
                                <motion.article key={item.id} initial="hidden" whileInView="visible" viewport={{ once: true, amount: .2 }} variants={fadeUp} transition={{ duration: .45, delay: index * .06 }}>
                                    <Card className="group h-full overflow-hidden border-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                                        <div className="h-2 bg-gradient-to-r from-emerald-800 via-emerald-500 to-[#f5c451]" />
                                        <div className="p-6"><div className="flex items-center justify-between gap-3"><Badge variant="secondary">{item.category || 'Informasi'}</Badge><span className="text-xs text-slate-500">{formatDate(item.created_at)}</span></div><h3 className="mt-4 font-heading text-xl font-bold leading-snug text-slate-900 group-hover:text-emerald-700">{item.title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{excerpt(item.content)}</p><Link to={`/berita/${item.slug}`} className="mt-5 inline-flex items-center text-sm font-semibold text-emerald-700">Baca selengkapnya <ChevronRight className="h-4 w-4" /></Link></div>
                                    </Card>
                                </motion.article>
                            ))}
                        </div>
                    </div>

                    <aside className="space-y-6">
                        <Card className="overflow-hidden border-emerald-100"><div className="flex items-center gap-3 bg-emerald-800 px-5 py-4 text-white"><Megaphone className="h-5 w-5 text-[#f5c451]" /><h3 className="font-heading text-lg font-bold">Pengumuman</h3></div><div className="divide-y divide-slate-100">{(announcements.length ? announcements : news.slice(0, 4)).map((item) => <Link key={item.id} to={`/berita/${item.slug}`} className="block p-5 transition hover:bg-emerald-50"><p className="font-semibold leading-snug text-slate-800">{item.title}</p><p className="mt-2 text-xs text-slate-500">{formatDate(item.created_at)}</p></Link>)}</div></Card>
                        <Card className="overflow-hidden border-slate-200"><div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4"><CalendarDays className="h-5 w-5 text-emerald-700" /><h3 className="font-heading text-lg font-bold text-slate-900">Agenda Kegiatan</h3></div><div className="space-y-1 p-4">{agenda.map((item) => <div key={item.title} className="flex gap-4 rounded-xl p-3 hover:bg-slate-50"><div className="min-w-14 rounded-xl bg-emerald-50 py-2 text-center"><strong className="block text-xl text-emerald-800">{item.day}</strong><span className="text-[10px] font-bold text-emerald-600">{item.month}</span></div><div><p className="text-sm font-semibold text-slate-800">{item.title}</p><p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><Clock3 className="h-3.5 w-3.5" /> {item.time}</p></div></div>)}</div></Card>
                    </aside>
                </div>
            </section>

            <section className="bg-[#073e27] py-14 text-white border-y border-[#f5c451]/20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            ['18', 'Kecamatan Terjangkau'],
                            ['179+', 'Kepenghuluan & Kelurahan'],
                            ['100%', 'Standar Kepatuhan SPKN & SAIPI'],
                            ['24/7', 'Akses Pengawasan Cloud Real-Time'],
                        ].map(([value, label]) => (
                            <div key={label} className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                <p className="font-heading text-4xl font-bold text-[#f5c451]">{value}</p>
                                <p className="mt-2 text-sm text-emerald-100/90">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div className="mb-7 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-emerald-700">Dokumentasi</p><h2 className="mt-2 font-heading text-3xl font-bold text-slate-900">Galeri Kegiatan</h2></div><Images className="h-7 w-7 text-emerald-700" /></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{gallery.map((item, index) => <motion.div key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: index * .07 }} className={`group relative min-h-56 overflow-hidden rounded-2xl bg-gradient-to-br ${item.className} p-5 shadow-lg`}><div className="absolute inset-0 bg-black/10 transition group-hover:bg-black/0" /><div className="relative flex h-full min-h-48 items-end"><div><p className="text-xs font-bold uppercase tracking-widest text-white/65">Inspektorat Rohil</p><h3 className="mt-2 font-heading text-xl font-bold text-white">{item.title}</h3></div></div></motion.div>)}</div></section>
        </PublicLayout>
    );
}
