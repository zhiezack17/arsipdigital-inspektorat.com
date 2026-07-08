import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { api, extractErrorMessage } from '@/lib/api';
import { ADMIN } from '@/constants/testIds';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { UserPlus, Pencil, Trash2, KeyRound, Loader2 } from 'lucide-react';

export default function AdminUsersPage() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [resetOpen, setResetOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    // Create form
    const [cUsername, setCUsername] = useState('');
    const [cFullName, setCFullName] = useState('');
    const [cPassword, setCPassword] = useState('');
    const [cRole, setCRole] = useState('auditor');
    const [cSubmitting, setCSubmitting] = useState(false);

    // Edit form
    const [eFullName, setEFullName] = useState('');
    const [eRole, setERole] = useState('auditor');
    const [eActive, setEActive] = useState(true);
    const [eSubmitting, setESubmitting] = useState(false);

    // Reset password
    const [rNewPassword, setRNewPassword] = useState('');
    const [rSubmitting, setRSubmitting] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/users');
            setUsers(data);
        } catch (e) {
            toast.error(extractErrorMessage(e, 'Gagal memuat daftar pengguna.'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const resetCreateForm = () => {
        setCUsername(''); setCFullName(''); setCPassword(''); setCRole('auditor');
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setCSubmitting(true);
        try {
            await api.post('/users', {
                username: cUsername.trim(),
                full_name: cFullName.trim(),
                password: cPassword,
                role: cRole,
            });
            toast.success('Pengguna berhasil dibuat.');
            resetCreateForm();
            setCreateOpen(false);
            await fetchUsers();
        } catch (err) {
            toast.error(extractErrorMessage(err, 'Gagal membuat pengguna.'));
        } finally {
            setCSubmitting(false);
        }
    };

    const openEdit = (u) => {
        setSelected(u);
        setEFullName(u.full_name || '');
        setERole(u.role);
        setEActive(u.is_active !== false);
        setEditOpen(true);
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        if (!selected) return;
        setESubmitting(true);
        try {
            await api.patch(`/users/${selected.id}`, {
                full_name: eFullName,
                role: eRole,
                is_active: eActive,
            });
            toast.success('Pengguna berhasil diperbarui.');
            setEditOpen(false);
            await fetchUsers();
        } catch (err) {
            toast.error(extractErrorMessage(err, 'Gagal memperbarui pengguna.'));
        } finally {
            setESubmitting(false);
        }
    };

    const openReset = (u) => {
        setSelected(u);
        setRNewPassword('');
        setResetOpen(true);
    };

    const handleReset = async (e) => {
        e.preventDefault();
        if (!selected) return;
        if (rNewPassword.length < 6) {
            toast.error('Kata sandi minimal 6 karakter.');
            return;
        }
        setRSubmitting(true);
        try {
            await api.post(`/users/${selected.id}/reset-password`, { new_password: rNewPassword });
            toast.success('Kata sandi berhasil direset.');
            setResetOpen(false);
        } catch (err) {
            toast.error(extractErrorMessage(err, 'Gagal mereset kata sandi.'));
        } finally {
            setRSubmitting(false);
        }
    };

    const handleDelete = async (u) => {
        try {
            await api.delete(`/users/${u.id}`);
            toast.success('Pengguna berhasil dihapus.');
            await fetchUsers();
        } catch (err) {
            toast.error(extractErrorMessage(err, 'Gagal menghapus pengguna.'));
        }
    };

    return (
        <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                    <h2 className="font-heading text-xl font-semibold">Manajemen Pengguna</h2>
                    <p className="text-sm text-muted-foreground">Kelola akun Admin dan Auditor.</p>
                </div>
                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                    <DialogTrigger asChild>
                        <Button data-testid={ADMIN.usersCreateButton}>
                            <UserPlus className="h-4 w-4 mr-2" /> Tambah Pengguna
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Tambah Pengguna Baru</DialogTitle>
                            <DialogDescription>Buat akun baru untuk Admin atau Auditor.</DialogDescription>
                        </DialogHeader>
                        <form className="space-y-3" onSubmit={handleCreate}>
                            <div>
                                <Label htmlFor="c-username">Nama Pengguna</Label>
                                <Input id="c-username" value={cUsername} onChange={(e) => setCUsername(e.target.value)} data-testid={ADMIN.userFormUsername} required minLength={3} />
                            </div>
                            <div>
                                <Label htmlFor="c-fullname">Nama Lengkap</Label>
                                <Input id="c-fullname" value={cFullName} onChange={(e) => setCFullName(e.target.value)} data-testid={ADMIN.userFormFullName} required minLength={2} />
                            </div>
                            <div>
                                <Label htmlFor="c-password">Kata Sandi Awal</Label>
                                <Input id="c-password" type="password" value={cPassword} onChange={(e) => setCPassword(e.target.value)} data-testid={ADMIN.userFormPassword} required minLength={6} />
                                <p className="text-xs text-muted-foreground mt-1">Minimal 6 karakter.</p>
                            </div>
                            <div>
                                <Label>Peran</Label>
                                <Select value={cRole} onValueChange={setCRole}>
                                    <SelectTrigger data-testid={ADMIN.userFormRole}><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="auditor">Auditor</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter className="mt-2">
                                <Button variant="outline" type="button" onClick={() => setCreateOpen(false)}>Batal</Button>
                                <Button type="submit" disabled={cSubmitting} data-testid={ADMIN.userFormSubmit}>
                                    {cSubmitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Menyimpan...</> : 'Simpan'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-lg border">
                <Table data-testid={ADMIN.usersTable}>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama Pengguna</TableHead>
                            <TableHead>Nama Lengkap</TableHead>
                            <TableHead>Peran</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            [0, 1, 2].map((i) => (
                                <TableRow key={i}>
                                    <TableCell colSpan={5}><Skeleton className="h-6 w-full" /></TableCell>
                                </TableRow>
                            ))
                        ) : users.length === 0 ? (
                            <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-6">Belum ada pengguna.</TableCell></TableRow>
                        ) : (
                            users.map((u) => (
                                <TableRow key={u.id}>
                                    <TableCell className="font-medium">@{u.username}</TableCell>
                                    <TableCell>{u.full_name}</TableCell>
                                    <TableCell>
                                        <Badge variant={u.role === 'admin' ? 'default' : 'secondary'} className="uppercase text-[10px] tracking-wide">
                                            {u.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {u.is_active !== false ? (
                                            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100">Aktif</Badge>
                                        ) : (
                                            <Badge variant="destructive">Nonaktif</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="inline-flex items-center gap-1">
                                            <Button variant="ghost" size="sm" onClick={() => openEdit(u)} data-testid={ADMIN.usersEditButton}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => openReset(u)} data-testid={ADMIN.usersResetPasswordButton}>
                                                <KeyRound className="h-4 w-4" />
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="sm" data-testid={ADMIN.usersDeleteButton} disabled={u.id === currentUser?.id}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Hapus Pengguna?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Tindakan ini tidak dapat dibatalkan. Pengguna <strong>{u.full_name}</strong> akan dihapus permanen.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Batal</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(u)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Hapus</AlertDialogAction>
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

            {/* Edit dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ubah Pengguna</DialogTitle>
                        <DialogDescription>Perbarui informasi pengguna @{selected?.username}.</DialogDescription>
                    </DialogHeader>
                    <form className="space-y-3" onSubmit={handleEdit}>
                        <div>
                            <Label>Nama Lengkap</Label>
                            <Input value={eFullName} onChange={(e) => setEFullName(e.target.value)} required minLength={2} />
                        </div>
                        <div>
                            <Label>Peran</Label>
                            <Select value={eRole} onValueChange={setERole} disabled={selected?.id === currentUser?.id}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="auditor">Auditor</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                            {selected?.id === currentUser?.id && (
                                <p className="text-xs text-muted-foreground mt-1">Peran akun Anda sendiri tidak dapat diubah.</p>
                            )}
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <div>
                                <div className="text-sm font-medium">Status Aktif</div>
                                <div className="text-xs text-muted-foreground">Nonaktifkan untuk memblokir login.</div>
                            </div>
                            <Switch checked={eActive} onCheckedChange={setEActive} disabled={selected?.id === currentUser?.id} />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={eSubmitting}>
                                {eSubmitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Menyimpan...</> : 'Simpan Perubahan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Reset password dialog */}
            <Dialog open={resetOpen} onOpenChange={setResetOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reset Kata Sandi</DialogTitle>
                        <DialogDescription>Set kata sandi baru untuk pengguna @{selected?.username}.</DialogDescription>
                    </DialogHeader>
                    <form className="space-y-3" onSubmit={handleReset}>
                        <div>
                            <Label>Kata Sandi Baru</Label>
                            <Input type="password" value={rNewPassword} onChange={(e) => setRNewPassword(e.target.value)} required minLength={6} />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setResetOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={rSubmitting}>
                                {rSubmitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Menyimpan...</> : 'Reset Kata Sandi'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
