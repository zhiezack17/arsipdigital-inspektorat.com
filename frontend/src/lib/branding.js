// Central branding constants for the Portal Arsip Digital Inspektorat Kab. Rokan Hilir.
// Logos are served from /public/assets and have been pre-processed to have transparent backgrounds.
export const LOGO_KAB_ROHIL = '/assets/rokan-hilir-logo.png';
export const LOGO_INSPEKTORAT = '/assets/inspektorat-logo.png';

export const PORTAL_NAME = 'Portal Arsip Digital';
export const INSTITUTION_NAME = 'Inspektorat Kabupaten Rokan Hilir';
export const INSTITUTION_TAGLINE = 'Anggaraksa Dharma';
export const GOVERNMENT_NAME = 'PEMERINTAH KABUPATEN ROKAN HILIR';
export const INSTITUTION_FULL_NAME = 'INSPEKTORAT DAERAH';

// Public contact info displayed on top-bar & footer.
export const CONTACT_PHONE = '0852 65 740 588';
export const CONTACT_EMAIL = 'info@arsipdigital-inspektorat.com';
export const CONTACT_ADDRESS = 'Kabupaten Rokan Hilir, Provinsi Riau';

// Public URLs for external ecosystem applications
export const KKA_URL = 'https://kka.arsipdigital-inspektorat.com';
export const IRBAN_1_URL = 'https://irban1.arsipdigital-inspektorat.com';
export const IRBAN_4_URL = 'https://irban4.arsipdigital-inspektorat.com';

export const APP_MENU = [
    {
        key: 'kka',
        title: 'KKA — Kertas Kerja Audit',
        description: 'Sistem Kertas Kerja Audit Desa & ADTT Terpadu Inspektorat',
        active: true,
        testId: 'app-card-kka',
        accent: 'blue',
        badge: 'Unggulan 2026',
        url: KKA_URL,
    },
    {
        key: 'irban_1',
        title: 'E-Arsip Irban I',
        description: 'Arsip digital Inspektur Pembantu Wilayah I',
        active: true,
        testId: 'app-card-irban-1',
        accent: 'green',
        badge: 'Aktif',
        url: IRBAN_1_URL,
    },
    {
        key: 'irban_4',
        title: 'E-Arsip Irban IV',
        description: 'Arsip digital Inspektur Pembantu Wilayah IV',
        active: true,
        testId: 'app-card-irban-4',
        accent: 'green',
        badge: 'Aktif',
        url: IRBAN_4_URL,
    },
    {
        key: 'irban_2',
        title: 'E-Arsip Irban II',
        description: 'Arsip digital Inspektur Pembantu Wilayah II',
        active: false,
        testId: 'app-card-irban-2',
        accent: 'green',
        badge: 'Segera Hadir',
        url: '',
    },
    {
        key: 'irban_3',
        title: 'E-Arsip Irban III',
        description: 'Arsip digital Inspektur Pembantu Wilayah III',
        active: false,
        testId: 'app-card-irban-3',
        accent: 'green',
        badge: 'Segera Hadir',
        url: '',
    },
    {
        key: 'irban_5',
        title: 'E-Arsip Irban V',
        description: 'Arsip digital Inspektur Pembantu Wilayah V',
        active: false,
        testId: 'app-card-irban-5',
        accent: 'green',
        badge: 'Segera Hadir',
        url: '',
    },
];

