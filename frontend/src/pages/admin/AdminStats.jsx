import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { api, extractErrorMessage } from '@/lib/api';
import { ADMIN } from '@/constants/testIds';
import { toast } from 'sonner';
import { Inbox, Send, Archive, Users, Loader2, Save } from 'lucide-react';

const FIELDS = [
    { key: 'total_surat_masuk', label: 'Total Surat Masuk', icon: Inbox, testId: ADMIN.statsSuratMasuk },
    { key: 'total_surat_keluar', label: 'Total Surat Keluar', icon: Send, testId: ADMIN.statsSuratKeluar },
    { key: 'total_arsip', label: 'Total Arsip', icon: Archive, testId: ADMIN.statsArsip },
    { key: 'total_auditor_aktif', label: 'Total Auditor Aktif', icon: Users, testId: ADMIN.statsAuditor },
];

export default function AdminStatsPage() {
    const [values, setValues] = useState({ total_surat_masuk: 0, total_surat_keluar: 0, total_arsip: 0, total_auditor_aktif: 0 });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await api.get('/stats');
                setValues({
                    total_surat_masuk: data.total_surat_masuk || 0,
                    total_surat_keluar: data.total_surat_keluar || 0,
                    total_arsip: data.total_arsip || 0,
                    total_auditor_aktif: data.total_auditor_aktif || 0,
                });
            } catch (e) {
                toast.error(extractErrorMessage(e, 'Gagal memuat statistik.'));
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.put('/stats', {
                total_surat_masuk: Number(values.total_surat_masuk) || 0,
                total_surat_keluar: Number(values.total_surat_keluar) || 0,
                total_arsip: Number(values.total_arsip) || 0,
                total_auditor_aktif: Number(values.total_auditor_aktif) || 0,
            });
            toast.success('Statistik berhasil disimpan.');
        } catch (err) {
            toast.error(extractErrorMessage(err, 'Gagal menyimpan statistik.'));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card className="p-4 sm:p-6">
            <div className="mb-4">
                <h2 className="font-heading text-xl font-semibold">Manajemen Statistik</h2>
                <p className="text-sm text-muted-foreground">
                    Ringkasan angka yang tampil di dashboard. Nantinya dapat disinkronkan otomatis dari aplikasi E-Arsip.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4" data-testid={ADMIN.statsForm}>
                {FIELDS.map(({ key, label, icon: Icon, testId }) => (
                    <div key={key} className="rounded-lg border p-4">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                                <Icon className="h-4 w-4" />
                            </div>
                            <Label className="text-sm">{label}</Label>
                        </div>
                        {loading ? (
                            <Skeleton className="h-10 w-full mt-3" />
                        ) : (
                            <Input
                                type="number"
                                min={0}
                                value={values[key]}
                                onChange={(e) => setValues({ ...values, [key]: e.target.value })}
                                className="mt-3"
                                data-testid={testId}
                            />
                        )}
                    </div>
                ))}
                <div className="sm:col-span-2 flex justify-end">
                    <Button type="submit" disabled={submitting || loading} data-testid={ADMIN.statsSaveButton}>
                        {submitting ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Menyimpan...</>) : (<><Save className="h-4 w-4 mr-2" /> Simpan Statistik</>)}
                    </Button>
                </div>
            </form>
        </Card>
    );
}
