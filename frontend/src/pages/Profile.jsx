import React, { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { api, extractErrorMessage } from '@/lib/api';
import { PROFILE } from '@/constants/testIds';
import { useAuth } from '@/context/AuthContext';
import { Loader2, ShieldCheck, KeyRound, User as UserIcon, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
    const { user } = useAuth();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        if (newPassword.length < 6) {
            setErrorMsg('Kata sandi baru minimal 6 karakter.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setErrorMsg('Konfirmasi kata sandi tidak cocok.');
            return;
        }
        setSubmitting(true);
        try {
            await api.post('/auth/change-password', {
                old_password: oldPassword,
                new_password: newPassword,
            });
            toast.success('Kata sandi berhasil diperbarui.');
            setOldPassword(''); setNewPassword(''); setConfirmPassword('');
        } catch (err) {
            setErrorMsg(extractErrorMessage(err, 'Gagal memperbarui kata sandi.'));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AppLayout>
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-6">
                    <h1 className="font-heading text-2xl sm:text-3xl font-semibold">Profil & Keamanan</h1>
                    <p className="text-sm text-muted-foreground mt-1">Kelola informasi akun Anda dan perbarui kata sandi secara berkala.</p>
                </div>

                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-semibold">
                            {(user?.full_name || user?.username || '?').slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                            <div className="font-heading text-lg font-semibold">{user?.full_name}</div>
                            <div className="text-sm text-muted-foreground inline-flex items-center gap-2">
                                <UserIcon className="h-3.5 w-3.5" /> @{user?.username}
                            </div>
                            <Badge variant="secondary" className="mt-2 text-[10px] uppercase tracking-wide">{user?.role}</Badge>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 mt-6">
                    <div className="flex items-center gap-2 mb-4">
                        <KeyRound className="h-5 w-5 text-primary" />
                        <h2 className="font-heading text-lg font-semibold">Ubah Kata Sandi</h2>
                    </div>
                    <form className="space-y-4 max-w-lg" onSubmit={onSubmit}>
                        <div>
                            <Label htmlFor="old">Kata Sandi Lama</Label>
                            <Input
                                id="old"
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                data-testid={PROFILE.oldPassword}
                                className="mt-1.5"
                            />
                        </div>
                        <div>
                            <Label htmlFor="new">Kata Sandi Baru</Label>
                            <Input
                                id="new"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                data-testid={PROFILE.newPassword}
                                className="mt-1.5"
                            />
                            <p className="text-xs text-muted-foreground mt-1">Minimal 6 karakter.</p>
                        </div>
                        <div>
                            <Label htmlFor="confirm">Konfirmasi Kata Sandi Baru</Label>
                            <Input
                                id="confirm"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                data-testid={PROFILE.confirmPassword}
                                className="mt-1.5"
                            />
                        </div>

                        {errorMsg && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{errorMsg}</AlertDescription>
                            </Alert>
                        )}

                        <Button type="submit" disabled={submitting} data-testid={PROFILE.saveButton}>
                            {submitting ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Menyimpan...</>) : (<><ShieldCheck className="h-4 w-4 mr-2" /> Perbarui Kata Sandi</>)}
                        </Button>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
