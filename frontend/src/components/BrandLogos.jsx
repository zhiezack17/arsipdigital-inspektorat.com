import React from 'react';
import { LOGO_KAB_ROHIL, LOGO_INSPEKTORAT, PORTAL_NAME, INSTITUTION_NAME, INSTITUTION_TAGLINE } from '@/lib/branding';

export const BrandLogos = ({ variant = 'header' }) => {
    if (variant === 'stacked') {
        return (
            <div className="flex flex-col items-center text-center gap-4">
                <div className="flex items-center justify-center gap-4">
                    <img
                        src={LOGO_KAB_ROHIL}
                        alt="Logo Kabupaten Rokan Hilir"
                        className="h-16 w-auto object-contain"
                    />
                    <div className="h-12 w-px bg-border" />
                    <img
                        src={LOGO_INSPEKTORAT}
                        alt="Logo Inspektorat Kabupaten Rokan Hilir - Anggaraksa Dharma"
                        className="h-16 w-auto object-contain"
                    />
                </div>
                <div>
                    <div className="font-heading text-lg font-semibold text-foreground">{PORTAL_NAME}</div>
                    <div className="text-sm text-muted-foreground">{INSTITUTION_NAME}</div>
                    <div className="text-xs text-muted-foreground italic">{INSTITUTION_TAGLINE}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <img
                src={LOGO_KAB_ROHIL}
                alt="Logo Kabupaten Rokan Hilir"
                className="h-10 w-auto object-contain"
            />
            <div className="h-8 w-px bg-border hidden sm:block" />
            <img
                src={LOGO_INSPEKTORAT}
                alt="Logo Inspektorat Kabupaten Rokan Hilir"
                className="h-10 w-auto object-contain hidden sm:block"
            />
            <div className="flex flex-col leading-tight">
                <span className="font-heading text-sm sm:text-base font-semibold text-foreground">{PORTAL_NAME}</span>
                <span className="text-[11px] sm:text-xs text-muted-foreground">{INSTITUTION_NAME}</span>
            </div>
        </div>
    );
};
