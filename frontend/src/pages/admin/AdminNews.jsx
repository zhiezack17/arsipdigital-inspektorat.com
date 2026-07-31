import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
    AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { api, extractErrorMessage } from '@/lib/api';
import { ADMIN } from '@/constants/testIds';
import { toast } from 'sonner';
import {
    Plus, Pencil, Trash2, Loader2, Eye, EyeOff, Image as ImageIcon, Star,
} from 'lucide-react';

const emptyForm = {
    title: '',
    content: '',
    category: 'Pengumuman',
    image_url: '',
    is_featured: false,
    is_published: true,
};

export default function AdminNewsPage() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);

    const fetchNews = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/news');
            setNews(data);
        } catch (e) {
            toast.error(extractErrorMessage(e, 'Gagal memuat berita.'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const openCreate = () => {
        setEditing(null);
        setForm({ ...emptyForm });
        setDialogOpen(true);
    };

    const openEdit = (item) => {
        setEditing(item);
        setForm({
            title: item.title || '',
            content: item.content || '',
            category: item.category || 'Pengumuman',
            image_url: item.image_url || '',
            is_featured: item.is_featured === true,
            is_published: item.is_published !== false,
        });
        setDialogOpen(true);
    };

    const uploadImage = async (event) => {
        const file = event.target.files?.[0];
        event.target.value = '';

        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Ukuran gambar maksimal 5 MB.');
            return;
        }

        setUploading(true);

        try {
            const uploadData = new FormData();
            uploadData.append('image', file);

            const { data } = await api.post('/news-image', uploadData);

            setForm((current) => ({
                ...current,
                image_url: data.image_url,
            }));

            toast.success('Gambar berhasil diunggah.');
        } catch (error) {
            toast.error(extractErrorMessage(error, 'Gagal mengunggah gambar.'));
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);

        try {
            if (editing) {
                await api.patch(`/news/${editing.id}`, form);
                toast.success('Berita berhasil diperbarui.');
            } else {
                await api.post('/news', form);
                toast.success('Berita berhasil dibuat.');
            }

            setDialogOpen(false);
            await fetchNews();
        } catch (error) {
            toast.error(extractErrorMessage(error, 'Gagal menyimpan berita.'));
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (item) => {
        try {
            await api.delete(`/news/${item.id}`);
            toast.success('Berita berhasil dihapus.');
            await fetchNews();
        } catch (error) {
            toast.error(extractErrorMessage(error, 'Gagal menghapus berita.'));
        }
    };

    const togglePublish = async (item) => {
        try {
            await api.patch(`/news/${item.id}`, {
                title: item.title,
                content: item.content,
                category: item.category || 'Pengumuman',
                image_url: item.image_url || null,
                is_featured: item.is_featured === true,
                is_published: !(item.is_published !== false),
            });

            toast.success('Status publikasi diperbarui.');
            await fetchNews();
        } catch (error) {
            toast.error(extractErrorMessage(error, 'Gagal memperbarui status.'));
        }
    };

    return (
        <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                    <h2 className="font-heading text-xl font-semibold">
                        Manajemen Berita & Pengumuman
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Publikasikan informasi resmi Inspektorat.
                    </p>
                </div>

                <Button onClick={openCreate} data-testid={ADMIN.newsCreateButton}>
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Berita
                </Button>
            </div>

            <div className="rounded-lg border">
                <Table data-testid={ADMIN.newsTable}>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Gambar</TableHead>
                            <TableHead>Judul</TableHead>
                            <TableHead>Kategori</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {loading ? (
                            [0, 1, 2].map((item) => (
                                <TableRow key={item}>
                                    <TableCell colSpan={5}>
                                        <Skeleton className="h-12 w-full" />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : news.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="text-center text-muted-foreground py-6"
                                >
                                    Belum ada berita.
                                </TableCell>
                            </TableRow>
                        ) : (
                            news.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        {item.image_url ? (
                                            <img
                                                src={item.image_url}
                                                alt=""
                                                className="h-14 w-20 rounded-md border object-cover"
                                            />
                                        ) : (
                                            <div className="h-14 w-20 rounded-md border bg-secondary flex items-center justify-center">
                                                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                        )}
                                    </TableCell>

                                    <TableCell className="max-w-[340px]">
                                        <div className="flex items-center gap-2">
                                            <div className="font-medium truncate">
                                                {item.title}
                                            </div>

                                            {item.is_featured && (
                                                <Badge className="shrink-0">
                                                    <Star className="h-3 w-3 mr-1" />
                                                    Utama
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="text-xs text-muted-foreground truncate">
                                            {item.content}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <Badge variant="secondary">
                                            {item.category || 'Pengumuman'}
                                        </Badge>
                                    </TableCell>

                                    <TableCell>
                                        <button
                                            type="button"
                                            onClick={() => togglePublish(item)}
                                            data-testid={ADMIN.newsPublishToggle}
                                            className="inline-flex items-center gap-2 rounded-md border px-2 py-1 text-xs hover:bg-secondary transition-colors"
                                        >
                                            {item.is_published !== false ? (
                                                <>
                                                    <Eye className="h-3.5 w-3.5 text-emerald-600" />
                                                    Publik
                                                </>
                                            ) : (
                                                <>
                                                    <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                                                    Draft
                                                </>
                                            )}
                                        </button>
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <div className="inline-flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openEdit(item)}
                                                data-testid={ADMIN.newsEditButton}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        data-testid={ADMIN.newsDeleteButton}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </AlertDialogTrigger>

                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Hapus Berita?
                                                        </AlertDialogTitle>

                                                        <AlertDialogDescription>
                                                            Berita &quot;{item.title}&quot; akan
                                                            dihapus permanen.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>

                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>
                                                            Batal
                                                        </AlertDialogCancel>

                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(item)}
                                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                        >
                                                            Hapus
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editing ? 'Ubah Berita' : 'Tambah Berita'}
                        </DialogTitle>

                        <DialogDescription>
                            Tambahkan gambar dan tentukan berita utama untuk
                            halaman publik.
                        </DialogDescription>
                    </DialogHeader>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <Label>Judul</Label>
                            <Input
                                value={form.title}
                                onChange={(event) =>
                                    setForm({ ...form, title: event.target.value })
                                }
                                data-testid={ADMIN.newsFormTitle}
                                required
                                minLength={3}
                            />
                        </div>

                        <div>
                            <Label>Kategori</Label>
                            <Input
                                value={form.category}
                                onChange={(event) =>
                                    setForm({ ...form, category: event.target.value })
                                }
                                data-testid={ADMIN.newsFormCategory}
                                placeholder="Contoh: Pengumuman, Berita, Kegiatan"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Gambar Berita</Label>

                            {form.image_url && (
                                <div className="relative">
                                    <img
                                        src={form.image_url}
                                        alt="Pratinjau berita"
                                        className="h-52 w-full rounded-lg border object-cover"
                                    />

                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="absolute right-2 top-2"
                                        onClick={() =>
                                            setForm({ ...form, image_url: '' })
                                        }
                                    >
                                        Hapus Gambar
                                    </Button>
                                </div>
                            )}

                            <Input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={uploadImage}
                                disabled={uploading}
                            />

                            <p className="text-xs text-muted-foreground">
                                Format JPG, PNG, atau WEBP. Maksimal 5 MB.
                            </p>

                            {uploading && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Mengunggah gambar...
                                </div>
                            )}
                        </div>

                        <div>
                            <Label>Isi Berita</Label>
                            <Textarea
                                rows={8}
                                value={form.content}
                                onChange={(event) =>
                                    setForm({ ...form, content: event.target.value })
                                }
                                data-testid={ADMIN.newsFormContent}
                                required
                                minLength={3}
                            />
                        </div>

                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <div>
                                <div className="text-sm font-medium">
                                    Berita Utama
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Berita utama akan ditampilkan lebih menonjol di
                                    halaman depan.
                                </div>
                            </div>

                            <Switch
                                checked={form.is_featured}
                                onCheckedChange={(value) =>
                                    setForm({ ...form, is_featured: value })
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <div>
                                <div className="text-sm font-medium">
                                    Publikasikan
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Aktifkan agar berita dapat dilihat masyarakat.
                                </div>
                            </div>

                            <Switch
                                checked={form.is_published}
                                onCheckedChange={(value) =>
                                    setForm({ ...form, is_published: value })
                                }
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => setDialogOpen(false)}
                            >
                                Batal
                            </Button>

                            <Button
                                type="submit"
                                disabled={submitting || uploading}
                                data-testid={ADMIN.newsFormSubmit}
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    'Simpan'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
