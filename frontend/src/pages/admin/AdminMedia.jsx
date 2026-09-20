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
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { api, extractErrorMessage } from '@/lib/api';
import { toast } from 'sonner';
import {
    Plus, Pencil, Trash2, Loader2, Image as ImageIcon,
    Video, Star, Eye, EyeOff, Upload,
} from 'lucide-react';

const emptyForm = {
    title: '',
    description: '',
    media_type: 'image',
    media_url: '',
    thumbnail_url: '',
    event_date: '',
    category: 'Kegiatan',
    location: '',
    is_featured: false,
    is_published: true,
};

export default function AdminMediaPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [uploading, setUploading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [externalUrl, setExternalUrl] = useState('');
    const [externalType, setExternalType] = useState('image');
    const [submitting, setSubmitting] = useState(false);

    const fetchMedia = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/media');
            setItems(data || []);
        } catch (error) {
            toast.error(extractErrorMessage(error, 'Gagal memuat Media Center.'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedia();
    }, []);

    const openCreate = () => {
        setEditing(null);
        setForm({ ...emptyForm });
        setSelectedFiles([]);
        setExternalUrl('');
        setExternalType('image');
        setDialogOpen(true);
    };

    const openEdit = (item) => {
        setEditing(item);
        setForm({
            title: item.title || '',
            description: item.description || '',
            media_type: item.media_type || 'image',
            media_url: item.media_url || '',
            thumbnail_url: item.thumbnail_url || '',
            event_date: item.event_date || '',
            category: item.category || 'Kegiatan',
            location: item.location || '',
            is_featured: item.is_featured === true,
            is_published: item.is_published !== false,
        });
        setDialogOpen(true);
    };

    const handleFilesSelected = (event) => {
        const files = Array.from(event.target.files || []);
        event.target.value = '';

        if (!files.length) return;

        if (files.length > 30) {
            toast.error('Maksimal 30 file dalam sekali upload.');
            return;
        }

        const invalid = files.find((file) => {
            const isImage = file.type.startsWith('image/');
            const isVideo = file.type.startsWith('video/');
            const maxSize = isVideo ? 1024 * 1024 * 1024 : 5 * 1024 * 1024;

            return (!isImage && !isVideo) || file.size > maxSize;
        });

        if (invalid) {
            toast.error(
                `File ${invalid.name} tidak valid atau ukurannya terlalu besar.`
            );
            return;
        }

        setSelectedFiles(files);
    };

    const saveExternalMedia = async () => {
        const url = externalUrl.trim();

        if (!url) {
            toast.error('Masukkan URL foto atau video.');
            return;
        }

        if (!/^https?:\/\//i.test(url)) {
            toast.error('URL harus diawali http:// atau https://');
            return;
        }

        if (!form.title.trim()) {
            toast.error('Judul wajib diisi untuk media dari URL.');
            return;
        }

        setUploading(true);

        try {
            await api.post('/media', {
                title: form.title.trim(),
                description: form.description || null,
                media_type: externalType,
                media_url: url,
                thumbnail_url: form.thumbnail_url || null,
                event_date: form.event_date || null,
                category: form.category || 'Kegiatan',
                location: form.location || null,
                is_featured: form.is_featured,
                is_published: form.is_published,
            });

            toast.success('Dokumentasi dari URL berhasil disimpan.');
            setExternalUrl('');
            setDialogOpen(false);
            await fetchMedia();
        } catch (error) {
            toast.error(
                extractErrorMessage(error, 'Gagal menyimpan media dari URL.')
            );
        } finally {
            setUploading(false);
        }
    };

    const uploadSelectedFiles = async () => {
        if (!selectedFiles.length) {
            toast.error('Pilih foto atau video terlebih dahulu.');
            return;
        }

        setUploading(true);

        try {
            const body = new FormData();
            selectedFiles.forEach((file) => body.append('files', file));

            const { data } = await api.post('/media-upload-multiple', body);

            const commonPayload = {
                description: form.description || null,
                event_date: form.event_date || null,
                category: form.category || 'Kegiatan',
                location: form.location || null,
                thumbnail_url: null,
                is_featured: form.is_featured,
                is_published: form.is_published,
            };

            await Promise.all(
                data.uploaded.map((item, index) =>
                    api.post('/media', {
                        ...commonPayload,
                        title:
                            selectedFiles[index]?.name?.replace(/\.[^.]+$/, '') ||
                            `Dokumentasi ${index + 1}`,
                        media_type: item.media_type,
                        media_url: item.media_url,
                    })
                )
            );

            toast.success(
                `${data.uploaded_count} file berhasil diunggah${
                    data.rejected_count
                        ? `, ${data.rejected_count} file ditolak`
                        : ''
                }.`
            );

            setSelectedFiles([]);
            setDialogOpen(false);
            await fetchMedia();
        } catch (error) {
            toast.error(
                extractErrorMessage(error, 'Gagal mengunggah dokumentasi.')
            );
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setSubmitting(true);

        const payload = {
            ...form,
            description: form.description || null,
            thumbnail_url: form.thumbnail_url || null,
            event_date: form.event_date || null,
            category: form.category || 'Kegiatan',
            location: form.location || null,
        };

        try {
            if (editing) {
                await api.patch(`/media/${editing.id}`, payload);
                toast.success('Media berhasil diperbarui.');
            } else {
                await api.post('/media', payload);
                toast.success('Media berhasil ditambahkan.');
            }

            setDialogOpen(false);
            await fetchMedia();
        } catch (error) {
            toast.error(extractErrorMessage(error, 'Gagal menyimpan media.'));
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (item) => {
        try {
            await api.delete(`/media/${item.id}`);
            toast.success('Media berhasil dihapus.');
            await fetchMedia();
        } catch (error) {
            toast.error(extractErrorMessage(error, 'Gagal menghapus media.'));
        }
    };

    const togglePublish = async (item) => {
        try {
            await api.patch(`/media/${item.id}`, {
                title: item.title,
                description: item.description || null,
                media_type: item.media_type,
                media_url: item.media_url,
                thumbnail_url: item.thumbnail_url || null,
                event_date: item.event_date || null,
                category: item.category || 'Kegiatan',
                location: item.location || null,
                is_featured: item.is_featured === true,
                is_published: !(item.is_published !== false),
            });

            toast.success('Status publikasi diperbarui.');
            await fetchMedia();
        } catch (error) {
            toast.error(extractErrorMessage(error, 'Gagal memperbarui status.'));
        }
    };

    return (
        <Card className="p-4 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                    <h2 className="font-heading text-xl font-semibold">
                        Media Center
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Kelola foto dan video dokumentasi kegiatan.
                    </p>
                </div>

                <Button onClick={openCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Media
                </Button>
            </div>

            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Preview</TableHead>
                            <TableHead>Informasi</TableHead>
                            <TableHead>Jenis</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {loading ? (
                            [1, 2, 3].map((item) => (
                                <TableRow key={item}>
                                    <TableCell colSpan={5}>
                                        <Skeleton className="h-14 w-full" />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : items.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="py-8 text-center text-muted-foreground"
                                >
                                    Belum ada foto atau video.
                                </TableCell>
                            </TableRow>
                        ) : (
                            items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className="h-16 w-24 overflow-hidden rounded-md border bg-secondary">
                                            {item.media_type === 'image' ? (
                                                <img
                                                    src={item.media_url}
                                                    alt=""
                                                    loading="lazy"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center">
                                                    <Video className="h-7 w-7 text-primary" />
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell className="max-w-[360px]">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">
                                                {item.title}
                                            </span>

                                            {item.is_featured && (
                                                <Badge>
                                                    <Star className="mr-1 h-3 w-3" />
                                                    Utama
                                                </Badge>
                                            )}
                                        </div>

                                        <p className="truncate text-xs text-muted-foreground">
                                            {item.category || 'Kegiatan'}
                                            {item.location ? ` · ${item.location}` : ''}
                                        </p>
                                    </TableCell>

                                    <TableCell>
                                        <Badge variant="secondary">
                                            {item.media_type === 'video'
                                                ? 'Video'
                                                : 'Foto'}
                                        </Badge>
                                    </TableCell>

                                    <TableCell>
                                        <button
                                            type="button"
                                            onClick={() => togglePublish(item)}
                                            className="inline-flex items-center gap-2 rounded-md border px-2 py-1 text-xs hover:bg-secondary"
                                        >
                                            {item.is_published !== false ? (
                                                <>
                                                    <Eye className="h-3.5 w-3.5 text-emerald-600" />
                                                    Publik
                                                </>
                                            ) : (
                                                <>
                                                    <EyeOff className="h-3.5 w-3.5" />
                                                    Draft
                                                </>
                                            )}
                                        </button>
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => openEdit(item)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </AlertDialogTrigger>

                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Hapus media?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        “{item.title}” akan dihapus dari daftar Media Center.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>

                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                        Batal
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDelete(item)}
                                                    >
                                                        Hapus
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>
                                {editing ? 'Edit Media' : 'Tambah Media'}
                            </DialogTitle>
                            <DialogDescription>
                                Unggah foto atau video dokumentasi kegiatan.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Foto atau Video</Label>

                                {form.media_url && (
                                    <div className="overflow-hidden rounded-lg border bg-black">
                                        {form.media_type === 'video' ? (
                                            <video
                                                src={form.media_url}
                                                controls
                                                className="max-h-72 w-full"
                                            />
                                        ) : (
                                            <img
                                                src={form.media_url}
                                                alt="Preview"
                                                className="max-h-72 w-full object-contain"
                                            />
                                        )}
                                    </div>
                                )}

                                <Input
                                    type="file"
                                    multiple
                                    accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
                                    onChange={handleFilesSelected}
                                    disabled={uploading}
                                />

                                <div className="relative py-2">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-background px-2 text-muted-foreground">
                                            atau gunakan URL
                                        </span>
                                    </div>
                                </div>

                                <div className="grid gap-2 sm:grid-cols-[140px_1fr]">
                                    <select
                                        value={externalType}
                                        onChange={(event) => setExternalType(event.target.value)}
                                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                        disabled={uploading || selectedFiles.length > 0}
                                    >
                                        <option value="image">URL Foto</option>
                                        <option value="video">URL Video</option>
                                    </select>

                                    <Input
                                        type="url"
                                        value={externalUrl}
                                        onChange={(event) => setExternalUrl(event.target.value)}
                                        placeholder="https://contoh.com/foto-atau-video"
                                        disabled={uploading || selectedFiles.length > 0}
                                    />
                                </div>

                                {externalUrl && (
                                    <div className="overflow-hidden rounded-lg border bg-secondary">
                                        {externalType === 'video' ? (
                                            <video
                                                src={externalUrl}
                                                controls
                                                className="max-h-64 w-full bg-black object-contain"
                                            />
                                        ) : (
                                            <img
                                                src={externalUrl}
                                                alt="Preview URL"
                                                className="max-h-64 w-full object-contain"
                                                onError={(event) => {
                                                    event.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        )}
                                    </div>
                                )}

                                <p className="text-xs text-muted-foreground">
                                    Maksimal 30 file. Foto maksimal 5 MB per file.
                                    Video maksimal 1 GB per file.
                                </p>

                                {selectedFiles.length > 0 && (
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {selectedFiles.map((file) => {
                                            const previewUrl = URL.createObjectURL(file);

                                            return (
                                                <div
                                                    key={`${file.name}-${file.size}`}
                                                    className="overflow-hidden rounded-lg border bg-secondary"
                                                >
                                                    {file.type.startsWith('video/') ? (
                                                        <video
                                                            src={previewUrl}
                                                            controls
                                                            className="h-36 w-full bg-black object-contain"
                                                        />
                                                    ) : (
                                                        <img
                                                            src={previewUrl}
                                                            alt={file.name}
                                                            className="h-36 w-full object-cover"
                                                        />
                                                    )}

                                                    <div className="truncate p-2 text-xs">
                                                        {file.name}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {uploading && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Mengunggah dokumentasi...
                                    </div>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label>Judul</Label>
                                <Input
                                    value={form.title}
                                    onChange={(event) => setForm({
                                        ...form,
                                        title: event.target.value,
                                    })}
                                    required
                                    minLength={3}
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label>Kategori</Label>
                                    <Input
                                        value={form.category}
                                        onChange={(event) => setForm({
                                            ...form,
                                            category: event.target.value,
                                        })}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label>Tanggal Kegiatan</Label>
                                    <Input
                                        type="date"
                                        value={form.event_date}
                                        onChange={(event) => setForm({
                                            ...form,
                                            event_date: event.target.value,
                                        })}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label>Lokasi</Label>
                                <Input
                                    value={form.location}
                                    onChange={(event) => setForm({
                                        ...form,
                                        location: event.target.value,
                                    })}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>Deskripsi</Label>
                                <Textarea
                                    rows={4}
                                    value={form.description}
                                    onChange={(event) => setForm({
                                        ...form,
                                        description: event.target.value,
                                    })}
                                />
                            </div>

                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <div>
                                    <Label>Media Utama</Label>
                                    <p className="text-xs text-muted-foreground">
                                        Tampilkan lebih menonjol pada portal publik.
                                    </p>
                                </div>

                                <Switch
                                    checked={form.is_featured}
                                    onCheckedChange={(value) => setForm({
                                        ...form,
                                        is_featured: value,
                                    })}
                                />
                            </div>

                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <div>
                                    <Label>Publikasikan</Label>
                                    <p className="text-xs text-muted-foreground">
                                        Media dapat dilihat oleh masyarakat.
                                    </p>
                                </div>

                                <Switch
                                    checked={form.is_published}
                                    onCheckedChange={(value) => setForm({
                                        ...form,
                                        is_published: value,
                                    })}
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setDialogOpen(false)}
                            >
                                Batal
                            </Button>

                            {editing ? (
                                <Button
                                    type="submit"
                                    disabled={submitting || uploading}
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        'Simpan Perubahan'
                                    )}
                                </Button>
                            ) : (
                                <Button
                                    type="button"
                                    onClick={
                                        selectedFiles.length > 0
                                            ? uploadSelectedFiles
                                            : saveExternalMedia
                                    }
                                    disabled={
                                        uploading ||
                                        (
                                            selectedFiles.length === 0 &&
                                            !externalUrl.trim()
                                        )
                                    }
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="mr-2 h-4 w-4" />
                                            {selectedFiles.length > 0
                                                ? 'Upload Dokumentasi'
                                                : 'Simpan dari URL'}
                                        </>
                                    )}
                                </Button>
                            )}
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </Card>
    );
}