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
import { toast } from 'sonner';
import {
    Plus, Pencil, Trash2, Loader2, CalendarDays, MapPin, Clock,
} from 'lucide-react';

const emptyForm = {
    title: '',
    agenda_date: '',
    start_time: '',
    end_time: '',
    location: '',
    description: '',
    is_active: true,
};

const formatDate = (value) => {
    if (!value) return '-';

    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(new Date(`${value}T00:00:00`));
};

export default function AdminAgendaPage() {
    const [agenda, setAgenda] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [submitting, setSubmitting] = useState(false);

    const fetchAgenda = async () => {
        setLoading(true);

        try {
            const { data } = await api.get('/agenda');
            setAgenda(data || []);
        } catch (error) {
            toast.error(extractErrorMessage(error, 'Gagal memuat agenda.'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgenda();
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
            agenda_date: item.agenda_date || '',
            start_time: item.start_time || '',
            end_time: item.end_time || '',
            location: item.location || '',
            description: item.description || '',
            is_active: item.is_active !== false,
        });
        setDialogOpen(true);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);

        const payload = {
            ...form,
            start_time: form.start_time || null,
            end_time: form.end_time || null,
            location: form.location || null,
            description: form.description || null,
        };

        try {
            if (editing) {
                await api.patch(`/agenda/${editing.id}`, payload);
                toast.success('Agenda berhasil diperbarui.');
            } else {
                await api.post('/agenda', payload);
                toast.success('Agenda berhasil dibuat.');
            }

            setDialogOpen(false);
            await fetchAgenda();
        } catch (error) {
            toast.error(extractErrorMessage(error, 'Gagal menyimpan agenda.'));
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (item) => {
        try {
            await api.delete(`/agenda/${item.id}`);
            toast.success('Agenda berhasil dihapus.');
            await fetchAgenda();
        } catch (error) {
            toast.error(extractErrorMessage(error, 'Gagal menghapus agenda.'));
        }
    };

    const toggleActive = async (item) => {
        try {
            await api.patch(`/agenda/${item.id}`, {
                title: item.title,
                agenda_date: item.agenda_date,
                start_time: item.start_time || null,
                end_time: item.end_time || null,
                location: item.location || null,
                description: item.description || null,
                is_active: !(item.is_active !== false),
            });

            toast.success('Status agenda diperbarui.');
            await fetchAgenda();
        } catch (error) {
            toast.error(extractErrorMessage(error, 'Gagal memperbarui status agenda.'));
        }
    };

    return (
        <Card className="p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                    <h2 className="font-heading text-xl font-semibold">
                        Manajemen Agenda
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Kelola agenda kegiatan yang tampil di portal publik.
                    </p>
                </div>

                <Button onClick={openCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Agenda
                </Button>
            </div>

            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Agenda</TableHead>
                            <TableHead>Tanggal & Waktu</TableHead>
                            <TableHead>Lokasi</TableHead>
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
                        ) : agenda.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="py-6 text-center text-muted-foreground"
                                >
                                    Belum ada agenda.
                                </TableCell>
                            </TableRow>
                        ) : (
                            agenda.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="max-w-[320px]">
                                        <div className="font-medium">{item.title}</div>
                                        {item.description && (
                                            <div className="truncate text-xs text-muted-foreground">
                                                {item.description}
                                            </div>
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex items-center gap-2 text-sm">
                                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                            {formatDate(item.agenda_date)}
                                        </div>

                                        {(item.start_time || item.end_time) && (
                                            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                                                <Clock className="h-3.5 w-3.5" />
                                                {item.start_time || '--:--'}
                                                {item.end_time ? ` - ${item.end_time}` : ''}
                                            </div>
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        {item.location ? (
                                            <div className="flex items-center gap-2 text-sm">
                                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                                {item.location}
                                            </div>
                                        ) : (
                                            <span className="text-sm text-muted-foreground">-</span>
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        <button
                                            type="button"
                                            onClick={() => toggleActive(item)}
                                            className="inline-flex items-center gap-2 rounded-md border px-2 py-1 text-xs transition-colors hover:bg-secondary"
                                        >
                                            <Switch
                                                checked={item.is_active !== false}
                                                className="pointer-events-none scale-75"
                                            />
                                            {item.is_active !== false ? 'Aktif' : 'Nonaktif'}
                                        </button>
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <div className="inline-flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openEdit(item)}
                                            >
                                                <Pencil className="mr-1 h-4 w-4" />
                                                Edit
                                            </Button>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <Trash2 className="mr-1 h-4 w-4 text-destructive" />
                                                        Hapus
                                                    </Button>
                                                </AlertDialogTrigger>

                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Hapus agenda?
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Agenda “{item.title}” akan dihapus permanen.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>

                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Batal</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(item)}
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
                <DialogContent className="max-w-2xl">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>
                                {editing ? 'Edit Agenda' : 'Tambah Agenda'}
                            </DialogTitle>
                            <DialogDescription>
                                Lengkapi informasi kegiatan di bawah ini.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="agenda-title">Judul Agenda</Label>
                                <Input
                                    id="agenda-title"
                                    value={form.title}
                                    onChange={(event) => setForm({
                                        ...form,
                                        title: event.target.value,
                                    })}
                                    required
                                    minLength={3}
                                    maxLength={200}
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="grid gap-2">
                                    <Label htmlFor="agenda-date">Tanggal</Label>
                                    <Input
                                        id="agenda-date"
                                        type="date"
                                        value={form.agenda_date}
                                        onChange={(event) => setForm({
                                            ...form,
                                            agenda_date: event.target.value,
                                        })}
                                        required
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="agenda-start">Jam Mulai</Label>
                                    <Input
                                        id="agenda-start"
                                        type="time"
                                        value={form.start_time}
                                        onChange={(event) => setForm({
                                            ...form,
                                            start_time: event.target.value,
                                        })}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="agenda-end">Jam Selesai</Label>
                                    <Input
                                        id="agenda-end"
                                        type="time"
                                        value={form.end_time}
                                        onChange={(event) => setForm({
                                            ...form,
                                            end_time: event.target.value,
                                        })}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="agenda-location">Lokasi</Label>
                                <Input
                                    id="agenda-location"
                                    value={form.location}
                                    onChange={(event) => setForm({
                                        ...form,
                                        location: event.target.value,
                                    })}
                                    placeholder="Contoh: Aula Kantor Inspektorat"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="agenda-description">Deskripsi</Label>
                                <Textarea
                                    id="agenda-description"
                                    rows={4}
                                    value={form.description}
                                    onChange={(event) => setForm({
                                        ...form,
                                        description: event.target.value,
                                    })}
                                    placeholder="Informasi singkat mengenai agenda"
                                />
                            </div>

                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <div>
                                    <Label htmlFor="agenda-active">Status Aktif</Label>
                                    <p className="text-xs text-muted-foreground">
                                        Agenda aktif dapat tampil pada portal publik.
                                    </p>
                                </div>

                                <Switch
                                    id="agenda-active"
                                    checked={form.is_active}
                                    onCheckedChange={(checked) => setForm({
                                        ...form,
                                        is_active: checked,
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

                            <Button type="submit" disabled={submitting}>
                                {submitting && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {editing ? 'Simpan Perubahan' : 'Tambah Agenda'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </Card>
    );
}