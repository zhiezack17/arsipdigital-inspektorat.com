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
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { api, extractErrorMessage } from '@/lib/api';
import { ADMIN } from '@/constants/testIds';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2, Eye, EyeOff } from 'lucide-react';

const emptyForm = { title: '', content: '', category: 'Pengumuman', is_published: true };

export default function AdminNewsPage() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [submitting, setSubmitting] = useState(false);

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

    useEffect(() => { fetchNews(); }, []);

    const openCreate = () => {
        setEditing(null);
        setForm(emptyForm);
        setDialogOpen(true);
    };

    const openEdit = (n) => {
        setEditing(n);
        setForm({ title: n.title, content: n.content, category: n.category || 'Pengumuman', is_published: n.is_published !== false });
        setDialogOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
        } catch (err) {
            toast.error(extractErrorMessage(err, 'Gagal menyimpan berita.'));
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (n) => {
        try {
            await api.delete(`/news/${n.id}`);
            toast.success('Berita berhasil dihapus.');
            await fetchNews();
        } catch (err) {
            toast.error(extractErrorMessage(err, 'Gagal menghapus berita.'));
        }
    };

    const togglePublish = async (n) => {
        try {
            await api.patch(`/news/${n.id}`, {
                title: n.title,
                content: n.content,
                category: n.category || 'Pengumuman',
                is_published: !(n.is_published !== false),
            });
            toast.success('Status publikasi diperbarui.');
            await fetchNews();
        } catch (err) {
            toast.error(extractErrorMessage(err, 'Gagal memperbarui status.'));
        }
    };

    return (
        <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                    <h2 className="font-heading text-xl font-semibold">Manajemen Berita & Pengumuman</h2>
                    <p className="text-sm text-muted-foreground">Publikasikan informasi resmi Inspektorat.</p>
                </div>
                <Button onClick={openCreate} data-testid={ADMIN.newsCreateButton}>
                    <Plus className="h-4 w-4 mr-2" /> Tambah Berita
                </Button>
            </div>

            <div className="rounded-lg border">
                <Table data-testid={ADMIN.newsTable}>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Judul</TableHead>
                            <TableHead>Kategori</TableHead>
                            <TableHead>Publikasi</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            [0, 1, 2].map((i) => (
                                <TableRow key={i}><TableCell colSpan={4}><Skeleton className="h-6 w-full" /></TableCell></TableRow>
                            ))
                        ) : news.length === 0 ? (
                            <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-6">Belum ada berita.</TableCell></TableRow>
                        ) : (
                            news.map((n) => (
                                <TableRow key={n.id}>
                                    <TableCell className="max-w-[380px]">
                                        <div className="font-medium truncate">{n.title}</div>
                                        <div className="text-xs text-muted-foreground truncate">{n.content}</div>
                                    </TableCell>
                                    <TableCell><Badge variant="secondary">{n.category || 'Pengumuman'}</Badge></TableCell>
                                    <TableCell>
                                        <button
                                            type="button"
                                            onClick={() => togglePublish(n)}
                                            data-testid={ADMIN.newsPublishToggle}
                                            className="inline-flex items-center gap-2 rounded-md border px-2 py-1 text-xs hover:bg-secondary transition-colors"
                                        >
                                            {n.is_published !== false ? (<><Eye className="h-3.5 w-3.5 text-emerald-600" /> Publik</>) : (<><EyeOff className="h-3.5 w-3.5 text-muted-foreground" /> Draft</>)}
                                        </button>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="inline-flex items-center gap-1">
                                            <Button variant="ghost" size="sm" onClick={() => openEdit(n)} data-testid={ADMIN.newsEditButton}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="sm" data-testid={ADMIN.newsDeleteButton}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Hapus Berita?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Berita &quot;{n.title}&quot; akan dihapus permanen.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Batal</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(n)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Hapus</AlertDialogAction>
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
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{editing ? 'Ubah Berita' : 'Tambah Berita'}</DialogTitle>
                        <DialogDescription>{editing ? 'Perbarui berita yang telah dipublikasikan.' : 'Publikasikan berita atau pengumuman baru.'}</DialogDescription>
                    </DialogHeader>
                    <form className="space-y-3" onSubmit={handleSubmit}>
                        <div>
                            <Label>Judul</Label>
                            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} data-testid={ADMIN.newsFormTitle} required minLength={3} />
                        </div>
                        <div>
                            <Label>Kategori</Label>
                            <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} data-testid={ADMIN.newsFormCategory} placeholder="contoh: Pengumuman, Berita, Kegiatan" />
                        </div>
                        <div>
                            <Label>Isi Berita</Label>
                            <Textarea rows={8} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} data-testid={ADMIN.newsFormContent} required minLength={3} />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <div>
                                <div className="text-sm font-medium">Publikasikan</div>
                                <div className="text-xs text-muted-foreground">Aktifkan untuk menampilkan di dashboard.</div>
                            </div>
                            <Switch checked={form.is_published} onCheckedChange={(v) => setForm({ ...form, is_published: v })} />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={submitting} data-testid={ADMIN.newsFormSubmit}>
                                {submitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Menyimpan...</> : 'Simpan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
