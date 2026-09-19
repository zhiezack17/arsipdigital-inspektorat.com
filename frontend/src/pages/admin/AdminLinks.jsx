import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { api, extractErrorMessage } from '@/lib/api';
import { ADMIN } from '@/constants/testIds';
import { toast } from 'sonner';
import { Link2, Save, Loader2, ExternalLink } from 'lucide-react';

const LINK_FIELDS = [
    { key: 'irban_1', label: 'E-Arsip Irban I', placeholder: 'https://irban1.arsipdigital-inspektorat.com' },
    { key: 'irban_2', label: 'E-Arsip Irban II', placeholder: 'https://irban2.arsipdigital-inspektorat.com' },
    { key: 'irban_3', label: 'E-Arsip Irban III', placeholder: 'https://irban3.arsipdigital-inspektorat.com' },
    { key: 'irban_4', label: 'E-Arsip Irban IV', placeholder: 'https://irban4.arsipdigital-inspektorat.com' },
    { key: 'irban_5', label: 'E-Arsip Irban V', placeholder: 'https://irban5.arsipdigital-inspektorat.com' },
    { key: 'kka', label: 'KKA — Kertas Kerja Audit', placeholder: 'https://kka.arsipdigital-inspektorat.com' },
];

export default function AdminLinksPage() {
    const [values, setValues] = useState({ irban_1: '', irban_2: '', irban_3: '', irban_4: '', irban_5: '', kka: '' });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await api.get('/links');
                setValues({
                    irban_1: data.irban_1 || '',
                    irban_2: data.irban_2 || '',
                    irban_3: data.irban_3 || '',
                    irban_4: data.irban_4 || '',
                    irban_5: data.irban_5 || '',
                    kka: data.kka || '',
                });
            } catch (e) {
                toast.error(extractErrorMessage(e, 'Gagal memuat URL subdomain.'));
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
            await api.put('/links', values);
            toast.success('URL subdomain berhasil disimpan.');
        } catch (err) {
            toast.error(extractErrorMessage(err, 'Gagal menyimpan URL.'));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card className="p-4 sm:p-6">
            <div className="mb-4">
                <h2 className="font-heading text-xl font-semibold">Manajemen URL Subdomain</h2>
                <p className="text-sm text-muted-foreground">
                    Perbarui tautan aplikasi E-Arsip. Kosongkan URL untuk menampilkan status &quot;Segera Hadir&quot;.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4" data-testid={ADMIN.linksForm}>
                {LINK_FIELDS.map(({ key, label, placeholder }) => (
                    <div key={key} className="rounded-lg border p-4">
                        <div className="flex items-center gap-2">
                            <Link2 className="h-4 w-4 text-primary" />
                            <Label className="text-sm">{label}</Label>
                        </div>
                        {loading ? (
                            <Skeleton className="h-10 w-full mt-3" />
                        ) : (
                            <div className="mt-3 flex items-center gap-2">
                                <Input
                                    type="url"
                                    value={values[key]}
                                    onChange={(e) => setValues({ ...values, [key]: e.target.value })}
                                    placeholder={placeholder}
                                    data-testid={`admin-links-input-${key}`}
                                />
                                {values[key] && (
                                    <a
                                        href={values[key]}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center justify-center h-10 w-10 rounded-md border hover:bg-secondary"
                                        title="Buka URL"
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                ))}
                <div className="sm:col-span-2 flex justify-end">
                    <Button type="submit" disabled={submitting || loading} data-testid={ADMIN.linksSaveButton}>
                        {submitting ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Menyimpan...</>) : (<><Save className="h-4 w-4 mr-2" /> Simpan URL</>)}
                    </Button>
                </div>
            </form>
        </Card>
    );
}
