import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Scale, BookOpen, Search, Filter, FileText, CheckCircle2, ShieldAlert,
    ExternalLink, Sparkles, ChevronRight, Info, AlertCircle, ArrowUpRight
} from 'lucide-react';
import { PublicLayout } from '@/components/PublicLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    FOTO_KANTOR, KKA_URL, GOVERNMENT_NAME, INSTITUTION_FULL_NAME
} from '@/lib/branding';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const REGULATION_DATA = [
    {
        id: 'spkn-2017',
        nomor: 'Peraturan BPK RI No. 1 Tahun 2017',
        judul: 'Standar Pemeriksaan Keuangan Negara (SPKN)',
        kategori: 'Standar Audit & APIP',
        tahun: '2017',
        instansi: 'Badan Pemeriksa Keuangan Republik Indonesia',
        ringkasan: 'Standar umum, standar pelaksanaan, dan standar pelaporan pemeriksaan keuangan negara bagi auditor BPK dan aparat pengawasan intern pemerintah (APIP) yang melakukan audit atas pengelolaan keuangan negara/daerah.',
        kaitanKka: 'Menjadi dasar metodologi pengujian 5 unsur Temuan KKA (Kondisi, Kriteria, Sebab, Akibat, Rekomendasi) serta kecukupan bukti audit (competent & sufficient audit evidence).',
        pasalPenting: [
            'Pernyataan Standar Pemeriksaan (PSP) 100: Standar Umum — Integritas, independensi, dan kemahiran profesional.',
            'PSP 200: Standar Pelaksanaan Pemeriksaan — Pengumpulan dan pengujian bukti pemeriksaan yang cukup dan kompeten.',
            'PSP 300: Standar Pelaporan — Penyusunan Laporan Hasil Pemeriksaan (LHP) yang memuat temuan 5 unsur dan tanggapan entitas.'
        ],
        dokumenUrl: 'https://peraturan.bpk.go.id/Details/44372/peraturan-bpk-no-1-tahun-2017',
        tag: 'Wajib'
    },
    {
        id: 'saipi-aaipi',
        nomor: 'Keputusan DPN AAIPI KEP-005/AAIPI/DPN/2021',
        judul: 'Standar Audit Intern Pemerintah Indonesia (SAIPI)',
        kategori: 'Standar Audit & APIP',
        tahun: '2021',
        instansi: 'Asosiasi Auditor Intern Pemerintah Indonesia (AAIPI)',
        ringkasan: 'Pedoman profesional yang mengatur atribut dan kinerja pengawasan internal pemerintah di seluruh kementerian, lembaga, dan pemerintah daerah.',
        kaitanKka: 'Mendasari alur review berjenjang di KKA Digital: Anggota Tim (Pengujian) -> Ketua Tim (Verifikasi) -> Pengendali Teknis/Dalnis (Supervisi) -> Pengendali Mutu/Irban (Validasi) -> Inspektur (Persetujuan Akhir).',
        pasalPenting: [
            'Standar Atribut 1100: Independensi dan Objektivitas — Posisi APIP dan netralitas penilai.',
            'Standar Kinerja 2300: Pelaksanaan Penugasan Pengawasan — Pengujian kepatuhan, keandalan data, dan dokumentasi Kertas Kerja Audit (KKA).',
            'Standar Kinerja 2340: Supervisi Penugasan — Supervisi bertingkat yang wajib terekam dalam jejak digital audit (audit trail).'
        ],
        dokumenUrl: 'https://aaipi.id/standar-audit/',
        tag: 'Wajib'
    },
    {
        id: 'permendagri-20-2018',
        nomor: 'Permendagri No. 20 Tahun 2018',
        judul: 'Pengelolaan Keuangan Desa',
        kategori: 'Pengelolaan Keuangan Desa',
        tahun: '2018',
        instansi: 'Kementerian Dalam Negeri Republik Indonesia',
        ringkasan: 'Regulasi fundamental yang mengatur azas, kekuasaan pengelolaan, struktur APBDes/APBKep, tata cara pengadaan, penatausahaan kas, pembukuan bendahara, dan pelaporan keuangan desa.',
        kaitanKka: 'Menjadi KRITERIA UTAMA dalam pengujian kepatuhan belanja desa pada KKA Digital: pengujian SPJ bukti pengeluaran kas, batasan kas di bendahara, verifikasi fisik pekerjaan, dan kewajiban perpajakan.',
        pasalPenting: [
            'Pasal 51-54: Penatausahaan Pengeluaran Kas — Bukti transaksi yang sah, verifikasi Kaur/Kasi, dan persetujuan Penghulu/Kades.',
            'Pasal 64: Pemotongan dan Penyetoran Pajak — Kewajiban Bendahara Desa memotong PPN, PPh Pasal 21, PPh Pasal 22, dan menyetorkannya ke Kas Negara tepat waktu.',
            'Pasal 68: Penutupan Buku Kas Umum (BKU) dan rekonsiliasi rekening koran kas desa.'
        ],
        dokumenUrl: 'https://peraturan.bpk.go.id/Details/111818/permendagri-no-20-tahun-2018',
        tag: 'Kriteria KKA'
    },
    {
        id: 'permendagri-73-2020',
        nomor: 'Permendagri No. 73 Tahun 2020',
        judul: 'Pengawasan Pengelolaan Keuangan Desa',
        kategori: 'Pengelolaan Keuangan Desa',
        tahun: '2020',
        instansi: 'Kementerian Dalam Negeri Republik Indonesia',
        ringkasan: 'Mengatur bentuk, mekanisme, dan prosedur pengawasan pengelolaan keuangan desa oleh Aparat Pengawasan Intern Pemerintah (APIP) Daerah Kabupaten/Kota dan Camat.',
        kaitanKka: 'Dasar hukum penerbitan Nota Dinas dan SPT Tim Audit APIP, kewenangan pemeriksaan kas mendadak (cash opname), audit fisik lapangan, serta batas waktu penyampaian LHP Desa kepada Bupati.',
        pasalPenting: [
            'Pasal 5: Ruang lingkup pengawasan keuangan desa oleh APIP Kabupaten mencakup audit, reviu, evaluasi, dan pemantauan.',
            'Pasal 14: Tata cara pelaksanaan pemeriksaan lapangan dan hak APIP mengakses seluruh dokumen asli pembukuan dan kas desa.',
            'Pasal 22: Penyampaian Laporan Hasil Pengawasan (LHP) kepada Bupati serta tindak lanjut rekomendasi oleh Penghulu/Kades.'
        ],
        dokumenUrl: 'https://peraturan.bpk.go.id/Details/159846/permendagri-no-73-tahun-2020',
        tag: 'Dasar SPT'
    },
    {
        id: 'pp-60-2008',
        nomor: 'Peraturan Pemerintah No. 60 Tahun 2008',
        judul: 'Sistem Pengendalian Intern Pemerintah (SPIP)',
        kategori: 'Pengendalian Intern & Pengawasan',
        tahun: '2008',
        instansi: 'Pemerintah Republik Indonesia',
        ringkasan: 'Mengatur proses integral pada tindakan dan kegiatan yang dilakukan secara terus menerus oleh pimpinan dan seluruh pegawai untuk memberikan keyakinan memadai atas tercapainya tujuan organisasi.',
        kaitanKka: 'Dasar dalam mengevaluasi pengendalian internal perangkat desa untuk menentukan ruang lingkup pengujian substantif dalam KKA.',
        pasalPenting: [
            'Pasal 13: Lingkungan Pengendalian — Penegakan integritas dan etika kepemimpinan.',
            'Pasal 47: Peran APIP dalam pemantauan efektivitas pengendalian intern dan early warning system.'
        ],
        dokumenUrl: 'https://peraturan.bpk.go.id/Details/4845/pp-no-60-tahun-2008',
        tag: 'SPIP'
    },
    {
        id: 'pp-12-2017',
        nomor: 'Peraturan Pemerintah No. 12 Tahun 2017',
        judul: 'Pembinaan dan Pengawasan Penyelenggaraan Pemerintahan Daerah',
        kategori: 'Pengendalian Intern & Pengawasan',
        tahun: '2017',
        instansi: 'Pemerintah Republik Indonesia',
        ringkasan: 'Mengatur pembinaan dan pengawasan umum serta teknis atas penyelenggaraan urusan pemerintahan daerah oleh Gubernur dan Menteri, serta peran Inspektorat Daerah terhadap OPD dan Desa.',
        kaitanKka: 'Memperkuat kedudukan hukum Inspektorat Daerah dalam memberikan rekomendasi perbaikan tata kelola dan tindak lanjut sanksi administratif bila terjadi penyimpangan.',
        pasalPenting: [
            'Pasal 10: Pengawasan intern atas akuntabilitas keuangan dan kinerja daerah.',
            'Pasal 19: Kewajiban kepala entitas yang diperiksa menindaklanjuti rekomendasi APIP selambat-lambatnya 60 hari.'
        ],
        dokumenUrl: 'https://peraturan.bpk.go.id/Details/45887/pp-no-12-tahun-2017',
        tag: 'Hukum APIP'
    },
    {
        id: 'perbup-rohil-desa',
        nomor: 'Peraturan Bupati Rokan Hilir',
        judul: 'Pedoman Pengelolaan dan Pengawasan Alokasi Dana Kepenghuluan (ADK) & Dana Desa',
        kategori: 'Regulasi Daerah Rokan Hilir',
        tahun: '2024',
        instansi: 'Pemerintah Kabupaten Rokan Hilir',
        ringkasan: 'Peraturan teknis kepala daerah mengenai tata cara pengalokasian, batas belanja operasional pemerintahan kepenghuluan, standar satuan harga barang/jasa daerah, dan evaluasi realisasi APBKep di Rokan Hilir.',
        kaitanKka: 'Menjadi rujukan penetapan batas kewajaran harga belanja barang/jasa dan honorarium aparatur kepenghuluan dalam pengujian KKA Desa.',
        pasalPenting: [
            'Ketentuan batas persentase penghasilan tetap (Siltap) dan operasional kantor kepenghuluan.',
            'Kewajiban pelaporan berkala pertanggungjawaban dana desa kepada Inspektorat Daerah dan Dinas PMD Rokan Hilir.'
        ],
        dokumenUrl: '#',
        tag: 'Daerah Rohil'
    }
];

const KATEGORI_LIST = [
    'Semua Regulasi',
    'Standar Audit & APIP',
    'Pengelolaan Keuangan Desa',
    'Pengendalian Intern & Pengawasan',
    'Regulasi Daerah Rokan Hilir'
];

export default function PublicRegulationsPage() {
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('Semua Regulasi');

    const filtered = useMemo(() => {
        return REGULATION_DATA.filter((item) => {
            const matchCategory = activeCategory === 'Semua Regulasi' || item.kategori === activeCategory;
            const q = search.toLowerCase().trim();
            const matchSearch =
                !q ||
                item.nomor.toLowerCase().includes(q) ||
                item.judul.toLowerCase().includes(q) ||
                item.ringkasan.toLowerCase().includes(q) ||
                item.kaitanKka.toLowerCase().includes(q);
            return matchCategory && matchSearch;
        });
    }, [search, activeCategory]);

    return (
        <PublicLayout>
            {/* Hero Section */}
            <section className="relative isolate overflow-hidden bg-[#063b25] text-white">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat filter brightness-[0.65] contrast-[1.05]"
                    style={{ backgroundImage: `url(${FOTO_KANTOR})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#063b25]/95 via-[#063b25]/85 to-[#063b25]/70 backdrop-blur-[0.5px]" />
                <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
                    <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5 }}>
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wide backdrop-blur">
                            <Scale className="h-4 w-4 text-[#f5c451]" /> LANDASAN HUKUM & STANDAR AUDIT
                        </div>
                        <p className="text-sm font-semibold uppercase tracking-wider text-[#f5c451]">
                            {GOVERNMENT_NAME} · {INSTITUTION_FULL_NAME}
                        </p>
                        <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                            Regulasi & Dasar Hukum Pengawasan APIP
                        </h1>
                        <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/85 sm:text-lg">
                            Kompilasi peraturan perundang-undangan, Standar Pemeriksaan Keuangan Negara (SPKN BPK), Standar Audit Intern Pemerintah Indonesia (SAIPI), serta pedoman pengelolaan keuangan desa yang menjadi acuan baku dalam pengujian KKA Digital.
                        </p>
                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            <a
                                href={KKA_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-lg bg-[#f5c451] px-5 py-2.5 text-sm font-bold text-[#064027] shadow transition hover:bg-[#ffd875]"
                            >
                                <Sparkles className="h-4 w-4" />
                                <span>Buka KKA Digital</span>
                                <ExternalLink className="h-3.5 w-3.5 opacity-75" />
                            </a>
                            <a
                                href="/profil"
                                className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/20"
                            >
                                <BookOpen className="h-4 w-4 text-[#f5c451]" />
                                <span>Pelajari Profil & Tupoksi Inspektorat</span>
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Filter & Search Bar */}
            <div className="sticky top-[105px] z-40 border-b border-slate-200 bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        {/* Search Input */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                type="text"
                                placeholder="Cari nomor peraturan, judul, atau kata kunci..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-emerald-600"
                            />
                        </div>

                        {/* Category Badges / Buttons */}
                        <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
                            {KATEGORI_LIST.map((kat) => {
                                const active = activeCategory === kat;
                                return (
                                    <button
                                        key={kat}
                                        onClick={() => setActiveCategory(kat)}
                                        className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                                            active
                                                ? 'bg-[#0e6b3f] text-white shadow-sm'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                        }`}
                                    >
                                        {kat}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content: Regulation Cards */}
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            Katalog Regulasi ({filtered.length})
                        </h2>
                        <p className="text-xs text-slate-500">
                            Menampilkan pedoman hukum yang mendasari pelaksanaan audit kepatuhan dan pembinaan desa
                        </p>
                    </div>
                    {search && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSearch('')}
                            className="text-xs text-slate-500 hover:text-slate-800"
                        >
                            Reset Pencarian
                        </Button>
                    )}
                </div>

                {filtered.length === 0 ? (
                    <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center">
                        <Scale className="mx-auto h-12 w-12 text-slate-400" />
                        <h3 className="mt-3 text-lg font-bold text-slate-700">Regulasi Tidak Ditemukan</h3>
                        <p className="mt-1 text-sm text-slate-500">
                            Tidak ada peraturan yang cocok dengan kata kunci "{search}".
                        </p>
                        <Button
                            onClick={() => { setSearch(''); setActiveCategory('Semua Regulasi'); }}
                            variant="outline"
                            className="mt-4"
                        >
                            Tampilkan Semua Regulasi
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-2">
                        {filtered.map((item) => (
                            <Card
                                key={item.id}
                                className="flex flex-col border border-slate-200 bg-white shadow-sm transition hover:border-emerald-500/50 hover:shadow-md"
                            >
                                <CardHeader className="pb-3 border-b border-slate-100">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                                <Badge className="bg-[#0e6b3f] hover:bg-[#0e6b3f] text-[11px]">
                                                    {item.kategori}
                                                </Badge>
                                                <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                                                    Tahun {item.tahun}
                                                </span>
                                                <span className="rounded bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-900">
                                                    {item.tag}
                                                </span>
                                            </div>
                                            <p className="text-xs font-semibold text-emerald-800 tracking-wide uppercase">
                                                {item.nomor}
                                            </p>
                                            <CardTitle className="mt-1 text-base sm:text-lg font-bold text-slate-900">
                                                {item.judul}
                                            </CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="flex-1 space-y-4 p-5 text-sm">
                                    {/* Ringkasan */}
                                    <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
                                        {item.ringkasan}
                                    </p>

                                    {/* Kaitan dengan KKA Digital */}
                                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5">
                                        <div className="flex items-start gap-2">
                                            <Sparkles className="h-4 w-4 text-emerald-700 mt-0.5 shrink-0" />
                                            <div>
                                                <p className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                                                    Relevansi & Kaitan dalam KKA Digital:
                                                </p>
                                                <p className="mt-1 text-xs sm:text-sm text-emerald-950 leading-relaxed font-medium">
                                                    {item.kaitanKka}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pasal / Standar Penting */}
                                    {item.pasalPenting && item.pasalPenting.length > 0 && (
                                        <div className="space-y-1.5 border-t border-slate-100 pt-3">
                                            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                                <Info className="h-3.5 w-3.5 text-slate-500" />
                                                Poin Standar / Pasal Krusial:
                                            </p>
                                            <ul className="space-y-1">
                                                {item.pasalPenting.map((p, pIdx) => (
                                                    <li key={pIdx} className="flex items-start gap-2 text-xs text-slate-600">
                                                        <ChevronRight className="h-3.5 w-3.5 text-[#0e6b3f] mt-0.5 shrink-0" />
                                                        <span>{p}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Tombol Tautan Referensi */}
                                    {item.dokumenUrl && item.dokumenUrl !== '#' && (
                                        <div className="pt-2">
                                            <a
                                                href={item.dokumenUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900 hover:underline"
                                            >
                                                <span>Buka Teks Asli di JDIH / Referensi Resmi</span>
                                                <ArrowUpRight className="h-3.5 w-3.5" />
                                            </a>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
