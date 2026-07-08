import React from 'react';
import { INSTITUTION_NAME, INSTITUTION_TAGLINE, PORTAL_NAME } from '@/lib/branding';
import { MapPin, Phone, Mail } from 'lucide-react';

export const AppFooter = () => {
    const year = new Date().getFullYear();
    return (
        <footer className="mt-16 border-t border-border bg-secondary/40">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <div className="font-heading text-base font-semibold text-foreground">{PORTAL_NAME}</div>
                        <div className="text-sm text-muted-foreground mt-1">{INSTITUTION_NAME}</div>
                        <div className="text-xs text-muted-foreground italic mt-0.5">{INSTITUTION_TAGLINE}</div>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-2">
                        <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                            <span>Kantor Inspektorat Kabupaten Rokan Hilir, Provinsi Riau</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-primary" />
                            <span>Hubungi Admin untuk informasi lebih lanjut</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-primary" />
                            <span>arsipdigital-inspektorat.com</span>
                        </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        <div className="font-medium text-foreground">Keamanan Portal</div>
                        <p className="mt-1 leading-relaxed">
                            Akses portal ini terbatas hanya untuk pengguna internal yang telah terdaftar.
                            Jangan bagikan kredensial Anda kepada pihak lain.
                        </p>
                    </div>
                </div>
                <div className="gold-divider my-6" />
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
                    <div>&copy; {year} Inspektorat Kabupaten Rokan Hilir. Seluruh hak cipta dilindungi.</div>
                    <div>Versi 1.0.0</div>
                </div>
            </div>
        </footer>
    );
};
