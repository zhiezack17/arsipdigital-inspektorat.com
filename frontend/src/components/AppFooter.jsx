import React from 'react';
import {
    INSTITUTION_NAME, INSTITUTION_TAGLINE, PORTAL_NAME,
    CONTACT_PHONE, CONTACT_EMAIL, CONTACT_ADDRESS,
    LOGO_KAB_ROHIL, LOGO_INSPEKTORAT,
} from '@/lib/branding';
import { MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';

export const AppFooter = () => {
    const year = new Date().getFullYear();
    return (
        <footer className="mt-16">
            {/* Dark green footer */}
            <div className="bg-[#0e6b3f] text-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <div className="flex items-center gap-3">
                                <img src={LOGO_KAB_ROHIL} alt="Logo Kab. Rokan Hilir" className="h-12 w-auto object-contain drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]" />
                                <img src={LOGO_INSPEKTORAT} alt="Logo Inspektorat" className="h-12 w-auto object-contain drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]" />
                            </div>
                            <div className="mt-3 font-heading text-base font-semibold">{PORTAL_NAME}</div>
                            <div className="text-sm text-white/80">{INSTITUTION_NAME}</div>
                            <div className="text-xs text-white/70 italic">{INSTITUTION_TAGLINE}</div>
                        </div>

                        <div className="text-sm space-y-3">
                            <div className="font-heading text-base font-semibold">Kontak Admin</div>
                            <div className="flex items-start gap-2 text-white/90">
                                <MapPin className="h-4 w-4 mt-0.5 text-[#f5c451]" />
                                <span>{CONTACT_ADDRESS}</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/90">
                                <Phone className="h-4 w-4 text-[#f5c451]" />
                                <a href={`tel:${CONTACT_PHONE.replace(/\s+/g, '')}`} className="hover:underline">{CONTACT_PHONE}</a>
                            </div>
                            <div className="flex items-center gap-2 text-white/90">
                                <Mail className="h-4 w-4 text-[#f5c451]" />
                                <a href={`mailto:${CONTACT_EMAIL}`} className="hover:underline">{CONTACT_EMAIL}</a>
                            </div>
                        </div>

                        <div className="text-sm text-white/90">
                            <div className="font-heading text-base font-semibold flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-[#f5c451]" /> Keamanan Portal
                            </div>
                            <p className="mt-3 leading-relaxed text-white/80">
                                Akses portal ini terbatas hanya untuk pengguna internal yang telah terdaftar.
                                Jangan bagikan kredensial Anda kepada pihak lain.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom copyright */}
            <div className="bg-[#0a5230] text-white/80">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                    <div>&copy; {year} Inspektorat Kabupaten Rokan Hilir. Seluruh hak cipta dilindungi.</div>
                    <div>Versi 1.0.0</div>
                </div>
            </div>
        </footer>
    );
};
