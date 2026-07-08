import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BrandLogos } from '@/components/BrandLogos';
import { LOGIN } from '@/constants/testIds';
import { INSTITUTION_NAME, PORTAL_NAME, INSTITUTION_TAGLINE } from '@/lib/branding';
import { ShieldCheck, Lock, User as UserIcon, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const { user, login, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    if (!loading && user) {
        const dest = location.state?.from?.pathname || '/dashboard';
        return <Navigate to={dest} replace />;
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        if (!username.trim() || !password) {
            setErrorMsg('Nama pengguna dan kata sandi wajib diisi.');
            return;
        }
        setSubmitting(true);
        const res = await login(username.trim(), password);
        setSubmitting(false);
        if (!res.ok) {
            setErrorMsg(res.error || 'Login gagal.');
            return;
        }
        toast.success(`Selamat datang, ${res.user.full_name || res.user.username}`);
        navigate('/dashboard', { replace: true });
    };

    return (
        <div className="relative min-h-screen bg-background overflow-hidden">
            <div className="absolute inset-0 hero-gradient" />
            <div className="noise-overlay" />

            <div className="relative mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-2 gap-8 px-4 sm:px-8 lg:px-12 py-10 items-center">
                {/* Left informational panel */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                    className="hidden lg:block"
                >
                    <BrandLogos variant="stacked" />
                    <div className="mt-10 max-w-lg">
                        <h1 className="font-heading text-3xl xl:text-4xl font-semibold tracking-tight text-foreground">
                            Portal Terpusat E-Arsip Inspektorat
                        </h1>
                        <p className="mt-3 text-muted-foreground leading-relaxed">
                            Akses aman untuk aplikasi E-Arsip Irban dan Kertas Kerja Audit (KKA) di lingkungan
                            Inspektorat Kabupaten Rokan Hilir. Portal ini hanya dapat diakses oleh pengguna
                            internal yang telah terdaftar.
                        </p>
                        <ul className="mt-6 space-y-3 text-sm text-foreground">
                            <li className="flex items-start gap-3">
                                <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                <span>Autentikasi terenkripsi dengan hash kata sandi.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Lock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                <span>Sesi otomatis berakhir demi keamanan data.</span>
                            </li>
                        </ul>
                    </div>
                </motion.div>

                {/* Right form panel */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.05, ease: [0.2, 0.8, 0.2, 1] }}
                    className="w-full max-w-md justify-self-center lg:justify-self-end"
                >
                    <div className="lg:hidden mb-6">
                        <BrandLogos variant="stacked" />
                    </div>

                    <Card className="p-6 sm:p-8 shadow-[0_10px_40px_rgba(2,6,23,0.08)]">
                        <div className="mb-6">
                            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-foreground">
                                <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Akses Aman
                            </div>
                            <h2 className="mt-3 font-heading text-2xl font-semibold">Masuk ke Portal</h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Silakan masuk menggunakan akun yang telah didaftarkan oleh Admin.
                            </p>
                        </div>

                        <form className="space-y-4" onSubmit={onSubmit}>
                            <div>
                                <Label htmlFor="username">Nama Pengguna</Label>
                                <div className="relative mt-1.5">
                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="username"
                                        type="text"
                                        autoComplete="username"
                                        placeholder="contoh: admin"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        data-testid={LOGIN.usernameInput}
                                        className="pl-9"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="password">Kata Sandi</Label>
                                <div className="relative mt-1.5">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        placeholder="Masukkan kata sandi"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        data-testid={LOGIN.passwordInput}
                                        className="pl-9 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((s) => !s)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
                                        aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            {errorMsg && (
                                <Alert variant="destructive" data-testid={LOGIN.errorText}>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{errorMsg}</AlertDescription>
                                </Alert>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-11 font-medium"
                                disabled={submitting}
                                data-testid={LOGIN.submitButton}
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Memproses...
                                    </>
                                ) : (
                                    <>Masuk</>
                                )}
                            </Button>

                            <p className="text-xs text-muted-foreground text-center">
                                Lupa kata sandi? Silakan hubungi Admin.
                                <br />
                                <span className="text-[11px]">Jangan bagikan kata sandi Anda kepada siapa pun.</span>
                            </p>
                        </form>
                    </Card>

                    <p className="mt-6 text-center text-xs text-muted-foreground">
                        {PORTAL_NAME} &middot; {INSTITUTION_NAME}
                        <br />
                        <span className="italic">{INSTITUTION_TAGLINE}</span>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
