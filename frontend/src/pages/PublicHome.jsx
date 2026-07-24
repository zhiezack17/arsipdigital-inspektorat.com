import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PublicLayout } from '@/components/PublicLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { publicApi } from '@/lib/api';
import { PORTAL_NAME, INSTITUTION_NAME, INSTITUTION_TAGLINE, GOVERNMENT_NAME } from '@/lib/branding';
import { PUBLIC } from '@/constants/testIds';
import {
    Newspaper, LogIn, ChevronRight, CalendarDays, Shield, Building2,
    ArrowRight, Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';

const formatDate = (iso) => {
    if (!iso) return '';
    try {
        return new Date(iso).toLocaleDateString('id-ID', {
            day: '2-digit', month: 'long', year: 'numeric',
        });
    } catch { return iso; }
};

const NewsCardSkeleton = () => (
    <Card className="p-5">
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-5 w-2/3 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-3/4" />
    </Card>
);

export default function PublicHomePage() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        publicApi.get('/public/news')
            .then(({ data }) => setNews((data || []).slice(0, 4)))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return (
        <PublicLayout>
            {/* Hero */}
            <section
                data-testid={PUBLIC.heroSection}
                className="relative overflow-hidden bg-gradient-to-br from-[#0e6b3f] via-[#0d5e35] to-[#064023]"
            >
                <div className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 20% 50%, #f5c451 0%, transparent 50%), radial-gradient(circle at 80% 20%, #ffffff 0%, transparent 40%)',
                    }}
                />
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                        className="max-w-3xl"
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur px-3 py-1 text-xs font-medium text-white/90 mb-4">
                            <Sparkles className="h-3.5 w-3.5 text-[#f5c451]" />
                            {PORTAL_NAME}
                        </div>
                        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                            Selamat Datang di Website Resmi
                        </h1>
                        <p className="mt-2 font-heading text-xl sm:text-2xl font-semibold text-[#f5c451]">
                            {INSTITUTION_NAME}
                        </p>
                        <p className="mt-1 text-sm text-white/70 italic">{GOVERNMENT_NAME} — {INSTITUTION_TAGLINE}</p>
                        <p className="mt-4 text-base sm:text-lg text-white/85 max-w-2xl">
                            Kami hadir untuk memberikan informasi resmi, pengumuman, dan berita terkini seputar kegiatan
                            Inspektorat Daerah Kabupaten Rokan Hilir kepada masyarakat umum.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Button asChild size="lg" className="bg-[#f5c451] text-[#0e6b3f] hover:bg-[#e8b83e] font-semibold">
                                <Link to="/berita" data-testid="public-berita-cta">
                                    <Newspaper className="h-5 w-5 mr-2" />
                                    Baca Berita &amp; Pengumuman
                                </Link>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="border-white/30 bg-white/10 text-white hover:bg-white/20"
                                data-testid={PUBLIC.loginCta}
                            >
                                <Link to="/login">
                                    <LogIn className="h-5 w-5 mr-2" />
                                    Login Portal Internal
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* About section */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6 border-l-4 border-l-[#0e6b3f]">
                        <Building2 className="h-8 w-8 text-[#0e6b3f] mb-3" />
                        <h3 className="font-heading text-lg font-semibold text-foreground">Tentang Inspektorat</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Inspektorat Daerah Kabupaten Rokan Hilir adalah aparat pengawas internal pemerintah daerah
                            yang bertugas melakukan pengawasan atas penyelenggaraan urusan pemerintahan.
                        </p>
                    </Card>
                    <Card className="p-6 border-l-4 border-l-[#f5c451]">
                        <Newspaper className="h-8 w-8 text-amber-600 mb-3" />
                        <h3 className="font-heading text-lg font-semibold text-foreground">Informasi Publik</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Temukan berita terkini, pengumuman resmi, dan informasi kegiatan audit yang relevan untuk
                            masyarakat Kabupaten Rokan Hilir.
                        </p>
                    </Card>
                    <Card className="p-6 border-l-4 border-l-slate-400">
                        <Shield className="h-8 w-8 text-slate-600 mb-3" />
                        <h3 className="font-heading text-lg font-semibold text-foreground">Portal Internal</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Pegawai dan auditor internal dapat mengakses sistem E-Arsip dan fitur pengelolaan dokumen
                            melalui portal login yang aman.
                        </p>
                        <Button asChild variant="outline" size="sm" className="mt-4" data-testid={PUBLIC.portalCta}>
                            <Link to="/login">
                                <LogIn className="h-4 w-4 mr-1.5" />
                                Masuk Portal
                            </Link>
                        </Button>
                    </Card>
                </div>
            </section>

            {/* Latest news */}
            <section
                data-testid={PUBLIC.newsSection}
                className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16"
            >
                <div className="flex items-end justify-between gap-4 mb-6">
                    <div>
                        <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground">
                            Berita &amp; Pengumuman Terbaru
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Informasi resmi dari Inspektorat Kabupaten Rokan Hilir
                        </p>
                    </div>
                    <Button asChild variant="outline" className="shrink-0">
                        <Link to="/berita">
                            Lihat Semua
                            <ArrowRight className="h-4 w-4 ml-1.5" />
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {loading ? (
                        [0, 1, 2, 3].map((i) => <NewsCardSkeleton key={i} />)
                    ) : news.length === 0 ? (
                        <div className="sm:col-span-2">
                            <Card className="p-8 text-center text-muted-foreground">
                                Belum ada berita yang dipublikasikan.
                            </Card>
                        </div>
                    ) : (
                        news.map((item) => (
                            <Card
                                key={item.id}
                                className="p-5 hover:shadow-[0_10px_30px_rgba(2,6,23,0.08)] transition-shadow"
                                data-testid={PUBLIC.newsCard}
                            >
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Badge variant="secondary" className="font-normal">
                                        {item.category || 'Pengumuman'}
                                    </Badge>
                                    <span className="inline-flex items-center gap-1">
                                        <CalendarDays className="h-3.5 w-3.5" />
                                        {formatDate(item.created_at)}
                                    </span>
                                </div>
                                <h3 className="mt-2 font-heading text-base font-semibold text-foreground line-clamp-2">
                                    {item.title}
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                                    {item.content}
                                </p>
                                <div className="mt-3">
                                    <Button
                                        asChild
                                        variant="ghost"
                                        size="sm"
                                        data-testid={PUBLIC.newsReadMoreLink}
                                    >
                                        <Link to={`/berita/${item.slug}`}>
                                            Baca selengkapnya
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </Link>
                                    </Button>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
