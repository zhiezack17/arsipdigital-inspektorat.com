import React, { useEffect, useMemo, useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/context/AuthContext';
import { api, extractErrorMessage } from '@/lib/api';
import { APP_MENU, PORTAL_NAME, INSTITUTION_NAME } from '@/lib/branding';
import { DASHBOARD } from '@/constants/testIds';
import {
    Inbox, Send, Archive, Users, Newspaper, ExternalLink, Clock, Sparkles,
    ArrowRight, ChevronRight, CalendarDays,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const STAT_ITEMS = [
    { key: 'total_surat_masuk', label: 'Total Surat Masuk', icon: Inbox, testId: DASHBOARD.kpiSuratMasuk, accent: 'text-emerald-700' },
    { key: 'total_surat_keluar', label: 'Total Surat Keluar', icon: Send, testId: DASHBOARD.kpiSuratKeluar, accent: 'text-sky-700' },
    { key: 'total_arsip', label: 'Total Arsip', icon: Archive, testId: DASHBOARD.kpiArsip, accent: 'text-amber-700' },
    { key: 'total_auditor_aktif', label: 'Total Auditor Aktif', icon: Users, testId: DASHBOARD.kpiAuditor, accent: 'text-indigo-700' },
];

const formatDate = (iso) => {
    if (!iso) return '';
    try {
        return new Date(iso).toLocaleString('id-ID', {
            day: '2-digit', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    } catch { return iso; }
};

const StatCard = ({ icon: Icon, label, value, accent, testId, loading }) => (
    <Card className="relative overflow-hidden p-5 hover:shadow-[0_10px_30px_rgba(2,6,23,0.08)] hover:-translate-y-0.5 transition-transform duration-200">
        <div className="flex items-start justify-between">
            <div className="flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
                {loading ? (
                    <Skeleton className="h-8 w-24 mt-2" />
                ) : (
                    <p className="mt-2 font-heading text-2xl sm:text-3xl font-semibold tabular-nums" data-testid={testId}>
                        {Number(value || 0).toLocaleString('id-ID')}
                    </p>
                )}
            </div>
            <div className={`h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center ${accent}`}>
                <Icon className="h-5 w-5" />
            </div>
        </div>
    </Card>
);

const MenuCard = ({ item, url }) => {
    const isActive = item.active && !!url;
    const cardBase = "group relative overflow-hidden p-5 border transition-all duration-200";
    const activeClass = "cursor-pointer hover:shadow-[0_12px_36px_rgba(2,6,23,0.10)] hover:-translate-y-1 border-border";
    const inactiveClass = "opacity-70 cursor-not-allowed border-dashed border-border/70 bg-secondary/40";

    const handleClick = () => {
        if (!isActive) {
            toast.info('Aplikasi ini sedang dipersiapkan.');
            return;
        }
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <Card
            className={`${cardBase} ${isActive ? activeClass : inactiveClass}`}
            onClick={handleClick}
            data-testid={item.testId}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
            aria-disabled={!isActive}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${item.accent === 'blue' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            <Archive className="h-5 w-5" />
                        </div>
                        {isActive ? (
                            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100">Aktif</Badge>
                        ) : (
                            <Badge className="bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100">Segera Hadir</Badge>
                        )}
                    </div>
                    <h3 className="mt-3 font-heading text-lg font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
                <span className={isActive ? 'text-primary font-medium inline-flex items-center gap-1' : 'text-muted-foreground'}>
                    {isActive ? (
                        <>
                            Buka Aplikasi
                            <ExternalLink className="h-3.5 w-3.5" />
                        </>
                    ) : (
                        <>Belum tersedia</>
                    )}
                </span>
                <ArrowRight className={`h-4 w-4 transition-transform duration-200 ${isActive ? 'text-primary group-hover:translate-x-1' : 'text-muted-foreground'}`} />
            </div>
        </Card>
    );
};

export default function DashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [links, setLinks] = useState(null);
    const [news, setNews] = useState([]);
    const [loadingStats, setLoadingStats] = useState(true);
    const [loadingNews, setLoadingNews] = useState(true);
    const [selectedNews, setSelectedNews] = useState(null);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [statsRes, linksRes, newsRes] = await Promise.all([
                    api.get('/stats'),
                    api.get('/links'),
                    api.get('/news'),
                ]);
                setStats(statsRes.data);
                setLinks(linksRes.data);
                setNews(newsRes.data || []);
            } catch (e) {
                toast.error(extractErrorMessage(e, 'Gagal memuat data dashboard.'));
            } finally {
                setLoadingStats(false);
                setLoadingNews(false);
            }
        };
        fetchAll();
    }, []);

    const publishedNews = useMemo(() => news.filter(n => n.is_published !== false), [news]);

    const scrollToAnnouncements = () => {
        document.getElementById('pengumuman')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <AppLayout>
            {/* Hero / Welcome banner */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 hero-gradient" />
                <div className="noise-overlay" />
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                        data-testid={DASHBOARD.welcomeBanner}
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 backdrop-blur px-3 py-1 text-xs font-medium text-foreground">
                            <Sparkles className="h-3.5 w-3.5 text-primary" />
                            {PORTAL_NAME}
                        </div>
                        <h1 className="mt-4 font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground max-w-3xl">
                            Selamat Datang, {user?.full_name || user?.username}.
                        </h1>
                        <p className="mt-3 text-base sm:text-lg text-muted-foreground max-w-2xl">
                            Portal terpusat E-Arsip {INSTITUTION_NAME}. Akses cepat ke aplikasi arsip digital Irban dan Kertas Kerja Audit (KKA).
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Button onClick={scrollToAnnouncements} data-testid={DASHBOARD.scrollAnnouncementsButton}>
                                <Newspaper className="h-4 w-4 mr-2" />
                                Lihat Pengumuman Terbaru
                            </Button>
                            <Button variant="outline" onClick={() => document.getElementById('menu-aplikasi')?.scrollIntoView({ behavior: 'smooth' })}>
                                Jelajahi Menu Aplikasi
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {STAT_ITEMS.map((s, idx) => (
                        <motion.div
                            key={s.key}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: idx * 0.05 }}
                        >
                            <StatCard
                                icon={s.icon}
                                label={s.label}
                                value={stats?.[s.key]}
                                accent={s.accent}
                                testId={s.testId}
                                loading={loadingStats}
                            />
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Menu Grid */}
            <section id="menu-aplikasi" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12">
                <div className="flex items-end justify-between gap-4 mb-4">
                    <div>
                        <h2 className="font-heading text-xl sm:text-2xl font-semibold">Menu Aplikasi E-Arsip</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Pilih aplikasi untuk membuka arsip digital di jendela baru.
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {APP_MENU.map((item) => (
                        <MenuCard key={item.key} item={item} url={links?.[item.key] || item.url} />
                    ))}
                </div>
            </section>

            {/* News & Announcements */}
            <section id="pengumuman" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12">
                <div className="flex items-end justify-between gap-4 mb-4">
                    <div>
                        <h2 className="font-heading text-xl sm:text-2xl font-semibold">Berita & Pengumuman</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Informasi resmi dari Inspektorat Kabupaten Rokan Hilir.
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" data-testid={DASHBOARD.newsFeed}>
                    <div className="lg:col-span-2 space-y-4">
                        {loadingNews ? (
                            <>
                                {[0, 1].map((i) => (
                                    <Card key={i} className="p-5">
                                        <Skeleton className="h-4 w-24 mb-2" />
                                        <Skeleton className="h-6 w-2/3 mb-2" />
                                        <Skeleton className="h-4 w-full mb-1" />
                                        <Skeleton className="h-4 w-3/4" />
                                    </Card>
                                ))}
                            </>
                        ) : publishedNews.length === 0 ? (
                            <Card className="p-8 text-center text-muted-foreground">
                                Belum ada pengumuman.
                            </Card>
                        ) : (
                            publishedNews.map((n) => (
                                <Card key={n.id} className="p-5 hover:shadow-[0_10px_30px_rgba(2,6,23,0.08)] transition-shadow" data-testid={DASHBOARD.newsItem}>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Badge variant="secondary" className="font-normal">{n.category || 'Pengumuman'}</Badge>
                                        <span className="inline-flex items-center gap-1">
                                            <CalendarDays className="h-3.5 w-3.5" />
                                            {formatDate(n.created_at)}
                                        </span>
                                    </div>
                                    <h3 className="mt-2 font-heading text-lg font-semibold text-foreground">{n.title}</h3>
                                    <p className="mt-1 text-sm text-muted-foreground line-clamp-3">{n.content}</p>
                                    <div className="mt-3">
                                        <Button variant="ghost" size="sm" onClick={() => setSelectedNews(n)} data-testid={DASHBOARD.newsOpenDetail}>
                                            Baca selengkapnya
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </Button>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>

                    {/* Side panel */}
                    <div className="space-y-4">
                        <Card className="p-5">
                            <div className="flex items-center gap-2 text-primary">
                                <Clock className="h-4 w-4" />
                                <h4 className="font-heading text-base font-semibold">Informasi Portal</h4>
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Portal ini hanya dapat diakses oleh pengguna internal Inspektorat.
                                Silakan hubungi Admin jika Anda memerlukan akses tambahan atau reset kata sandi.
                            </p>
                        </Card>
                        <Card className="p-5">
                            <h4 className="font-heading text-base font-semibold">Ringkasan Aplikasi</h4>
                            <ul className="mt-3 space-y-2 text-sm">
                                {APP_MENU.map((m) => (
                                    <li key={m.key} className="flex items-center justify-between">
                                        <span className="text-foreground">{m.title}</span>
                                        {m.active ? (
                                            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100">Aktif</Badge>
                                        ) : (
                                            <Badge className="bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100">Soon</Badge>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    </div>
                </div>
            </section>

            {/* News Detail Dialog */}
            <Dialog open={!!selectedNews} onOpenChange={(o) => !o && setSelectedNews(null)}>
                <DialogContent className="max-w-2xl" data-testid={DASHBOARD.newsDetailDialog}>
                    <DialogHeader>
                        <DialogTitle data-testid={DASHBOARD.newsDetailTitle}>{selectedNews?.title}</DialogTitle>
                        <DialogDescription>
                            <span className="inline-flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="font-normal">{selectedNews?.category || 'Pengumuman'}</Badge>
                                <span className="inline-flex items-center gap-1 text-xs">
                                    <CalendarDays className="h-3.5 w-3.5" />
                                    {formatDate(selectedNews?.created_at)}
                                </span>
                                {selectedNews?.author && <span className="text-xs">• {selectedNews.author}</span>}
                            </span>
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="max-h-[50vh] pr-2">
                        <div
                            className="whitespace-pre-wrap text-sm leading-6 text-foreground"
                            data-testid={DASHBOARD.newsDetailContent}
                        >
                            {selectedNews?.content}
                        </div>
                    </ScrollArea>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedNews(null)}>Tutup</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
