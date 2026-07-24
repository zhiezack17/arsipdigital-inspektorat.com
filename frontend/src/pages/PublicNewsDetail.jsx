import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { PublicLayout } from '@/components/PublicLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { publicApi } from '@/lib/api';
import { PUBLIC } from '@/constants/testIds';
import { CalendarDays, ArrowLeft, User as UserIcon, Share2 } from 'lucide-react';
import { toast } from 'sonner';

const formatDate = (iso) => {
    if (!iso) return '';
    try {
        return new Date(iso).toLocaleDateString('id-ID', {
            day: '2-digit', month: 'long', year: 'numeric',
        });
    } catch { return iso; }
};

export default function PublicNewsDetailPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!slug) { setNotFound(true); setLoading(false); return; }
        setLoading(true);
        publicApi.get(`/public/news/${encodeURIComponent(slug)}`)
            .then(({ data }) => setItem(data))
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [slug]);

    const handleShare = () => {
        const url = window.location.href;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url)
                .then(() => toast.success('Link berhasil disalin!'))
                .catch(() => toast.error('Gagal menyalin link.'));
        } else {
            toast.info('Salin URL dari address bar browser Anda.');
        }
    };

    return (
        <PublicLayout>
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
                {/* Back */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
                    onClick={() => navigate('/berita')}
                    data-testid={PUBLIC.newsDetailBack}
                >
                    <ArrowLeft className="h-4 w-4 mr-1.5" />
                    Kembali ke Daftar Berita
                </Button>

                {loading ? (
                    <Card className="p-8">
                        <Skeleton className="h-4 w-20 mb-4" />
                        <Skeleton className="h-8 w-3/4 mb-3" />
                        <Skeleton className="h-4 w-40 mb-6" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-4/5 mb-2" />
                        <Skeleton className="h-4 w-2/3" />
                    </Card>
                ) : notFound ? (
                    <Card className="p-10 text-center">
                        <p className="text-muted-foreground text-lg mb-4">Berita tidak ditemukan.</p>
                        <Button asChild variant="outline">
                            <Link to="/berita">Kembali ke Daftar Berita</Link>
                        </Button>
                    </Card>
                ) : (
                    <Card className="p-8">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-4">
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

                        <h1
                            className="font-heading text-2xl sm:text-3xl font-bold text-foreground leading-snug"
                            data-testid={PUBLIC.newsDetailTitle}
                        >
                            {item.title}
                        </h1>

                        <div className="mt-1 h-px bg-border" />

                        <div
                            className="mt-6 text-sm sm:text-base text-foreground leading-7 whitespace-pre-wrap"
                            data-testid={PUBLIC.newsDetailContent}
                        >
                            {item.content}
                        </div>

                        {/* Share */}
                        <div className="mt-8 flex items-center gap-3 pt-6 border-t border-border">
                            <Button variant="outline" size="sm" onClick={handleShare}>
                                <Share2 className="h-4 w-4 mr-1.5" />
                                Bagikan Berita Ini
                            </Button>
                            <Button asChild variant="ghost" size="sm">
                                <Link to="/berita">
                                    <ArrowLeft className="h-4 w-4 mr-1.5" />
                                    Berita Lainnya
                                </Link>
                            </Button>
                        </div>
                    </Card>
                )}
            </div>
        </PublicLayout>
    );
}
