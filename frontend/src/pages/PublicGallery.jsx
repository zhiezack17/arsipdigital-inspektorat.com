import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Images, Image as ImageIcon, Video, Play, Calendar, MapPin, Search,
    Filter, X, ArrowLeft, Layers, ShieldCheck, Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PublicLayout } from '@/components/PublicLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { publicApi } from '@/lib/api';
import {
    FOTO_KANTOR, GOVERNMENT_NAME, INSTITUTION_FULL_NAME
} from '@/lib/branding';

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

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export default function PublicGalleryPage() {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeType, setActiveType] = useState('all'); // 'all', 'image', 'video'
    const [activeCategory, setActiveCategory] = useState('all');
    const [selectedMedia, setSelectedMedia] = useState(null);

    useEffect(() => {
        setLoading(true);
        publicApi.get('/public/media')
            .then(({ data }) => setMedia(data || []))
            .catch(() => setMedia([]))
            .finally(() => setLoading(false));
    }, []);

    // Extract unique categories
    const categories = useMemo(() => {
        const set = new Set();
        media.forEach(item => {
            if (item.category) set.add(item.category);
        });
        return Array.from(set);
    }, [media]);

    // Filter media
    const filteredMedia = useMemo(() => {
        return media.filter(item => {
            const matchesType = activeType === 'all' || item.media_type === activeType;
            const matchesCat = activeCategory === 'all' || item.category === activeCategory;
            const q = search.toLowerCase();
            const matchesSearch = !search ||
                (item.title && item.title.toLowerCase().includes(q)) ||
                (item.description && item.description.toLowerCase().includes(q)) ||
                (item.location && item.location.toLowerCase().includes(q));
            return matchesType && matchesCat && matchesSearch;
        });
    }, [media, activeType, activeCategory, search]);

    return (
        <PublicLayout>
            {/* Hero Header */}
            <section className="relative isolate overflow-hidden bg-[#063b25] py-14 text-white">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat filter brightness-[0.45] contrast-[1.1]"
                    style={{ backgroundImage: `url(${FOTO_KANTOR})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#063b25]/95 via-[#063b25]/85 to-[#063b25]/75" />
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur">
                            <Images className="h-3.5 w-3.5 text-[#f5c451]" /> DOKUMENTASI VISUAL RESMI
                        </div>
                        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-white">
                            Galeri Kegiatan Inspektorat
                        </h1>
                        <p className="mt-3 text-base text-emerald-100/90 leading-relaxed">
                            Dokumentasi foto dan video kegiatan pengawasan, pemeriksaan reguler, asistensi tata kelola pemerintahan, hingga pembinaan aparatur di lingkungan Pemerintah Kabupaten Rokan Hilir.
                        </p>
                    </div>
                </div>
            </section>

            {/* Content & Filters */}
            <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                {/* Search and Filters Bar */}
                <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    {/* Media Type Tabs */}
                    <div className="flex flex-wrap items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => setActiveType('all')}
                            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                                activeType === 'all'
                                    ? 'bg-emerald-800 text-white shadow-sm'
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            Semua ({media.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveType('image')}
                            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                                activeType === 'image'
                                    ? 'bg-emerald-800 text-white shadow-sm'
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            <ImageIcon className="h-3.5 w-3.5" />
                            Foto ({media.filter(m => m.media_type === 'image').length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveType('video')}
                            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                                activeType === 'video'
                                    ? 'bg-emerald-800 text-white shadow-sm'
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            <Video className="h-3.5 w-3.5" />
                            Video ({media.filter(m => m.media_type === 'video').length})
                        </button>
                    </div>

                    {/* Search Input */}
                    <div className="relative min-w-[260px]">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            type="text"
                            placeholder="Cari dokumentasi kegiatan..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 text-xs h-9"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Category Pills if more than 1 category exists */}
                {categories.length > 0 && (
                    <div className="mb-6 flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
                            <Filter className="h-3.5 w-3.5" /> Kategori:
                        </span>
                        <Badge
                            variant={activeCategory === 'all' ? 'default' : 'outline'}
                            onClick={() => setActiveCategory('all')}
                            className="cursor-pointer text-xs"
                        >
                            Semua Kategori
                        </Badge>
                        {categories.map((cat) => (
                            <Badge
                                key={cat}
                                variant={activeCategory === cat ? 'default' : 'outline'}
                                onClick={() => setActiveCategory(cat)}
                                className="cursor-pointer text-xs"
                            >
                                {cat}
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Gallery Grid */}
                {loading ? (
                    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <Card key={n} className="overflow-hidden p-0">
                                <Skeleton className="h-48 w-full" />
                                <div className="p-4 space-y-2">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-5 w-full" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : filteredMedia.length === 0 ? (
                    <Card className="p-16 text-center border-dashed border-slate-300">
                        <Images className="mx-auto h-14 w-14 text-slate-300 mb-3" />
                        <h3 className="font-heading text-lg font-bold text-slate-800">
                            Tidak ada dokumentasi yang cocok
                        </h3>
                        <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
                            {search || activeType !== 'all' || activeCategory !== 'all'
                                ? 'Coba ubah kata kunci pencarian atau reset filter untuk melihat dokumentasi lainnya.'
                                : 'Belum ada foto atau video kegiatan yang dipublikasikan.'}
                        </p>
                        {(search || activeType !== 'all' || activeCategory !== 'all') && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setSearch('');
                                    setActiveType('all');
                                    setActiveCategory('all');
                                }}
                                className="mt-4"
                            >
                                Reset Filter
                            </Button>
                        )}
                    </Card>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {filteredMedia.map((item, index) => (
                            <motion.button
                                key={item.id || index}
                                type="button"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeUp}
                                transition={{ delay: index * 0.04 }}
                                onClick={() => setSelectedMedia(item)}
                                className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="relative h-48 w-full overflow-hidden bg-emerald-950">
                                    {item.media_type === 'video' ? (
                                        item.thumbnail_url ? (
                                            <img
                                                src={item.thumbnail_url}
                                                alt={item.title}
                                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <video
                                                src={item.media_url}
                                                muted
                                                preload="metadata"
                                                className="h-full w-full object-cover"
                                            />
                                        )
                                    ) : (
                                        <img
                                            src={item.media_url}
                                            alt={item.title}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                                    {/* Media Type Badge */}
                                    <div className="absolute left-3 top-3">
                                        <Badge className="bg-black/60 text-white backdrop-blur-sm border-0 text-[10px] font-semibold">
                                            {item.media_type === 'video' ? (
                                                <><Video className="mr-1 h-3 w-3" /> Video</>
                                            ) : (
                                                <><ImageIcon className="mr-1 h-3 w-3" /> Foto</>
                                            )}
                                        </Badge>
                                    </div>

                                    {item.media_type === 'video' && (
                                        <span className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-emerald-800 shadow-lg group-hover:scale-110 transition">
                                            <Play className="ml-0.5 h-4 w-4 fill-current" />
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-1 flex-col p-4">
                                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                                        <span className="font-semibold text-emerald-700">
                                            {item.category || 'Kegiatan'}
                                        </span>
                                        {item.event_date && (
                                            <span>{formatDate(item.event_date)}</span>
                                        )}
                                    </div>

                                    <h3 className="font-heading text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-emerald-700 transition">
                                        {item.title}
                                    </h3>

                                    {item.location && (
                                        <p className="mt-2 flex items-center gap-1 text-[11px] text-slate-500 truncate">
                                            <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                                            <span className="truncate">{item.location}</span>
                                        </p>
                                    )}
                                </div>
                            </motion.button>
                        ))}
                    </div>
                )}
            </section>

            {/* Modal Lightbox Foto / Video */}
            {selectedMedia && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setSelectedMedia(null)}
                    role="presentation"
                >
                    <div
                        className="max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-slate-900 shadow-2xl border border-white/10"
                        onClick={(e) => e.stopPropagation()}
                        role="presentation"
                    >
                        <div className="relative flex items-center justify-center bg-black min-h-[320px] max-h-[70vh]">
                            {selectedMedia.media_type === 'video' ? (
                                <video
                                    src={selectedMedia.media_url}
                                    controls
                                    autoPlay
                                    className="max-h-[70vh] w-full object-contain"
                                />
                            ) : (
                                <img
                                    src={selectedMedia.media_url}
                                    alt={selectedMedia.title}
                                    className="max-h-[70vh] w-full object-contain"
                                />
                            )}
                            <button
                                type="button"
                                onClick={() => setSelectedMedia(null)}
                                className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white hover:bg-black transition"
                                aria-label="Tutup"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5">
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-800 border-emerald-200">
                                        {selectedMedia.category || 'Kegiatan'}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                        {selectedMedia.media_type === 'video' ? 'Video' : 'Foto'}
                                    </Badge>
                                    {selectedMedia.event_date && (
                                        <span className="text-xs text-slate-500">
                                            {formatDate(selectedMedia.event_date)}
                                        </span>
                                    )}
                                </div>
                                <h3 className="mt-2 font-heading text-lg font-bold text-slate-900 leading-snug">
                                    {selectedMedia.title}
                                </h3>
                                {selectedMedia.location && (
                                    <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                                        <MapPin className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                                        <span>{selectedMedia.location}</span>
                                    </p>
                                )}
                                {selectedMedia.description && (
                                    <p className="mt-2 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2">
                                        {selectedMedia.description}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedMedia(null)}
                                >
                                    Tutup
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}
