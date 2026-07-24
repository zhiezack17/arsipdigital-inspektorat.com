import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PublicLayout } from '@/components/PublicLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { publicApi } from '@/lib/api';
import { PUBLIC } from '@/constants/testIds';
import { CalendarDays, ChevronRight, Newspaper, User as UserIcon } from 'lucide-react';

const formatDate = (iso) => {
    if (!iso) return '';
    try {
        return new Date(iso).toLocaleDateString('id-ID', {
            day: '2-digit', month: 'long', year: 'numeric',
        });
    } catch { return iso; }
};

export default function PublicNewsListPage() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        publicApi.get('/public/news')
            .then(({ data }) => setNews(data || []))
            .catch(() => setError('Gagal memuat berita. Silakan coba lagi nanti.'))
            .finally(() => setLoading(false));
    }, []);

    return (
        <PublicLayout>
            {/* Page header */}
            <section className="bg-gradient-to-r from-[#0e6b3f] to-[#075a34] py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 text-white">
                        <Newspaper className="h-7 w-7" />
                        <div>
                            <h1 className="font-heading text-2xl sm:text-3xl font-bold">
                                Berita &amp; Pengumuman
                            </h1>
                            <p className="text-sm text-white/80 mt-0.5">
                                Informasi resmi dari Inspektorat Kabupaten Rokan Hilir
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* News list */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
                {error && (
                    <Card className="p-8 text-center text-destructive">{error}</Card>
                )}

                {loading ? (
                    <div className="space-y-4">
                        {[0, 1, 2, 3].map((i) => (
                            <Card key={i} className="p-6">
                                <Skeleton className="h-4 w-20 mb-3" />
                                <Skeleton className="h-6 w-2/3 mb-2" />
                                <Skeleton className="h-4 w-full mb-1" />
                                <Skeleton className="h-4 w-4/5" />
                            </Card>
                        ))}
                    </div>
                ) : !error && news.length === 0 ? (
                    <Card className="p-10 text-center text-muted-foreground">
                        Belum ada berita yang dipublikasikan.
                    </Card>
                ) : (
                    <div className="space-y-5">
                        {news.map((item) => (
                            <Card
                                key={item.id}
                                className="p-6 hover:shadow-[0_10px_30px_rgba(2,6,23,0.08)] transition-shadow"
                                data-testid={PUBLIC.newsListItem}
                            >
                                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-2">
                                    <Badge variant="secondary" className="font-normal">
                                        {item.category || 'Pengumuman'}
                                    </Badge>
                                    <span className="inline-flex items-center gap-1">
                                        <CalendarDays className="h-3.5 w-3.5" />
                                        {formatDate(item.created_at)}
                                    </span>
                                    {item.author && (
                                        <span className="inline-flex items-center gap-1">
                                            <UserIcon className="h-3.5 w-3.5" />
                                            {item.author}
                                        </span>
                                    )}
                                </div>
                                <h2 className="font-heading text-xl font-semibold text-foreground">
                                    {item.title}
                                </h2>
                                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                                    {item.content}
                                </p>
                                <div className="mt-4">
                                    <Button asChild variant="outline" size="sm">
                                        <Link to={`/berita/${item.slug}`} data-testid={PUBLIC.newsReadMoreLink}>
                                            Baca selengkapnya
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </Link>
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </section>
        </PublicLayout>
    );
}
