import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ShieldCheck, Building2, Target, Award, Users, ChevronRight, CheckCircle2,
    BookOpen, Scale, Sparkles, ExternalLink, FileCheck, Layers
} from 'lucide-react';
import { PublicLayout } from '@/components/PublicLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    LOGO_KAB_ROHIL, LOGO_INSPEKTORAT, FOTO_KANTOR, KKA_URL,
    GOVERNMENT_NAME, INSTITUTION_FULL_NAME, INSTITUTION_TAGLINE
} from '@/lib/branding';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const strukturOrganisasi = [
    {
        jabatan: 'Inspektur Daerah',
        deskripsi: 'Memimpin pelaksanaan tugas pokok dan fungsi Inspektorat Daerah dalam pembinaan dan pengawasan intern pemerintahan daerah.',
        status: 'Pimpinan APIP',
        level: 'primary',
    },
    {
        jabatan: 'Sekretariat Inspektorat',
        deskripsi: 'Mengoordinasikan perencanaan, administrasi umum, kepegawaian, keuangan, serta pemantauan dan evaluasi tindak lanjut hasil pengawasan.',
        status: 'Dukungan Manajemen & Regulasi',
        level: 'secondary',
        sub: ['Subbagian Umum & Kepegawaian', 'Subbagian Perencanaan & Keuangan', 'Subbagian Evaluasi & Pelaporan']
    },
    {
        jabatan: 'Inspektur Pembantu Wilayah I (Irban I)',
        deskripsi: 'Melaksanakan pembinaan dan pengawasan terhadap urusan pemerintahan bidang tata kelola dan perangkat daerah Wilayah I.',
        status: 'Pengawasan Wilayah I',
        level: 'irban',
    },
    {
        jabatan: 'Inspektur Pembantu Wilayah II (Irban II)',
        deskripsi: 'Melaksanakan pembinaan dan pengawasan terhadap urusan pemerintahan bidang perekonomian, keuangan daerah, dan Wilayah II.',
        status: 'Pengawasan Wilayah II',
        level: 'irban',
    },
    {
        jabatan: 'Inspektur Pembantu Wilayah III (Irban III)',
        deskripsi: 'Melaksanakan pembinaan dan pengawasan terhadap bidang sarana prasarana, pembangunan daerah, dan Wilayah III.',
        status: 'Pengawasan Wilayah III',
        level: 'irban',
    },
    {
        jabatan: 'Inspektur Pembantu Wilayah IV (Irban IV)',
        deskripsi: 'Melaksanakan pembinaan, pengawasan, dan audit terpadu atas pengelolaan keuangan dan aset Pemerintah Desa / Kepenghuluan di Kabupaten Rokan Hilir.',
        status: 'Audit Desa & KKA Digital',
        level: 'irban-highlight',
    },
    {
        jabatan: 'Inspektur Pembantu Khusus / Investigasi (Irban V)',
        deskripsi: 'Menangani pemeriksaan dengan tujuan tertentu (PDTT), audit investigatif, penanganan pengaduan masyarakat, serta koordinasi pencegahan korupsi.',
        status: 'Investigasi & PDTT',
        level: 'irban',
    },
    {
        jabatan: 'Kelompok Jabatan Fungsional (JFA & PPUPD)',
        deskripsi: 'Tenaga fungsional auditor dan pengawas urusan pemerintahan daerah yang bertugas melaksanakan audit teknis substantif, reviu, dan evaluasi.',
        status: 'Auditor Lapangan',
        level: 'fungsional',
    }
];

const nilaiKodeEtik = [
    {
        judul: 'Integritas',
        ikon: ShieldCheck,
        deskripsi: 'Membangun kepercayaan publik melalui kejujuran, ketegasan prinsip, dan keberanian moral dalam menegakkan kebenaran.',
    },
    {
        judul: 'Objektivitas',
        ikon: Scale,
        deskripsi: 'Menjunjung tinggi netralitas dan tidak membiarkan pertimbangan subjektif mengaburkan penilaian profesional.',
    },
    {
        judul: 'Kerahasiaan',
        ikon: BookOpen,
        deskripsi: 'Melindungi dan menjaga integritas informasi kertas kerja audit serta data rahasia entitas yang diperiksa.',
    },
    {
        judul: 'Kompetensi',
        ikon: Award,
        deskripsi: 'Terus mengasah kapabilitas teknis, kemahiran profesional, dan standar audit terbaru dalam setiap penugasan.',
    },
];

export default function PublicProfilePage() {
    const [activeTab, setActiveTab] = useState('visimisi');

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
                            <Building2 className="h-4 w-4 text-[#f5c451]" /> PROFIL RESMI INSPEKTORAT DAERAH
                        </div>
                        <p className="text-sm font-semibold uppercase tracking-wider text-[#f5c451]">
                            {GOVERNMENT_NAME}
                        </p>
                        <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                            Mengawal Akuntabilitas, Menegakkan Integritas Daerah
                        </h1>
                        <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/85 sm:text-lg">
                            Inspektorat Daerah Kabupaten Rokan Hilir bertindak sebagai Aparat Pengawasan Intern Pemerintah (APIP) yang profesional, independen, dan berorientasi pada peningkatan tata kelola pemerintahan yang bersih serta pelayanan publik berkualitas.
                        </p>
                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            <a
                                href={KKA_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-lg bg-[#f5c451] px-5 py-2.5 text-sm font-bold text-[#064027] shadow transition hover:bg-[#ffd875]"
                            >
                                <Sparkles className="h-4 w-4" />
                                <span>Akses KKA Digital</span>
                                <ExternalLink className="h-3.5 w-3.5 opacity-75" />
                            </a>
                            <a
                                href="/regulasi"
                                className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/20"
                            >
                                <Scale className="h-4 w-4 text-[#f5c451]" />
                                <span>Lihat Dasar Hukum & Regulasi Audit</span>
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Quick Navigation Tabs */}
            <div className="sticky top-[105px] z-40 border-b border-slate-200 bg-white shadow-sm">
                <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8">
                    {[
                        { id: 'visimisi', label: 'Visi & Misi', icon: Target },
                        { id: 'tupoksi', label: 'Tugas Pokok & Fungsi', icon: FileCheck },
                        { id: 'struktur', label: 'Struktur Organisasi', icon: Users },
                        { id: 'kodeetik', label: 'Kode Etik & Nilai APIP', icon: Award },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        const active = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    const el = document.getElementById(tab.id);
                                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }}
                                className={`inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition ${
                                    active
                                        ? 'bg-[#0e6b3f] text-white shadow-sm'
                                        : 'text-slate-650 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                            >
                                <Icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content Sections */}
            <div className="mx-auto max-w-7xl space-y-16 px-4 py-12 sm:px-6 lg:px-8">
                {/* 1. Visi & Misi */}
                <section id="visimisi" className="scroll-mt-36">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-800">
                            <Target className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                Visi dan Misi Pengawasan
                            </h2>
                            <p className="text-sm text-slate-600">Arah strategis pengawasan intern Pemerintah Kabupaten Rokan Hilir</p>
                        </div>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-12">
                        <Card className="border-2 border-emerald-600/30 bg-gradient-to-br from-emerald-50 via-white to-amber-50/30 shadow-md lg:col-span-5">
                            <CardHeader>
                                <Badge className="w-fit bg-[#0e6b3f] hover:bg-[#0e6b3f]">VISI UTAMA</Badge>
                                <CardTitle className="text-xl font-bold text-slate-900">
                                    Pemerintahan Bersih, Akuntabel, dan Transparan
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <blockquote className="border-l-4 border-[#f5c451] pl-4 italic text-slate-800 text-base leading-relaxed">
                                    "Terwujudnya Tata Kelola Pemerintahan Daerah yang Bersih, Efektif, Transparan, dan Akuntabel Berbasis Pengawasan Intern yang Profesional, Terintegrasi, dan Berkelanjutan."
                                </blockquote>
                                <div className="mt-6 flex items-center gap-3 rounded-lg bg-emerald-900/5 p-3 text-xs text-emerald-950 font-medium">
                                    <Sparkles className="h-4 w-4 text-emerald-700 shrink-0" />
                                    <span>Mewujudkan semboyan <strong>Anggaraksa Dharma</strong>: Memelihara kebajikan dan menegakkan keadilan pengawasan.</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200 shadow-sm lg:col-span-7">
                            <CardHeader>
                                <Badge variant="outline" className="w-fit border-emerald-700 text-emerald-800 font-semibold">MISI STRATEGIS</Badge>
                                <CardTitle className="text-xl font-bold text-slate-900">
                                    Empat Pilar Pengawasan APIP Rokan Hilir
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[
                                    {
                                        no: '1',
                                        title: 'Peningkatan Kualitas Pengawasan Intern Daerah',
                                        desc: 'Melaksanakan audit kepatuhan, audit kinerja, dan asistensi pendampingan secara profesional berbasis risiko dan kepatuhan hukum.'
                                    },
                                    {
                                        no: '2',
                                        title: 'Penguatan Sistem Pengendalian Intern Pemerintah (SPIP)',
                                        desc: 'Mendorong maturitas SPIP di seluruh organisasi perangkat daerah (OPD) dan 250+ Pemerintah Desa/Kepenghuluan di Rokan Hilir.'
                                    },
                                    {
                                        no: '3',
                                        title: 'Digitalisasi Tata Kelola Kertas Kerja Audit (KKA Digital)',
                                        desc: 'Mengintegrasikan arsip digital pemeriksaan desa, memperkuat bukti audit (audit trail), dan menjamin transparansi tindak lanjut rekomendasi (TLHP).'
                                    },
                                    {
                                        no: '4',
                                        title: 'Pencegahan Korupsi & Penegakan Integritas',
                                        desc: 'Mengoptimalkan fungsi konsultatif, pengaduan masyarakat (whistleblowing), audit investigasi, serta pengendalian gratifikasi.'
                                    },
                                ].map((item) => (
                                    <div key={item.no} className="flex items-start gap-4 rounded-lg p-3 transition hover:bg-slate-50 border border-slate-100">
                                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#0e6b3f] text-sm font-bold text-white">
                                            {item.no}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900">{item.title}</h3>
                                            <p className="text-sm text-slate-600 mt-0.5">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* 2. Tugas Pokok & Fungsi (Tupoksi) */}
                <section id="tupoksi" className="scroll-mt-36">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-100 text-amber-800">
                            <FileCheck className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                Kedudukan, Tugas Pokok & Fungsi APIP
                            </h2>
                            <p className="text-sm text-slate-600">Landasan pelaksanaan wewenang pengawasan sesuai regulasi perundang-undangan</p>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="bg-slate-50/80 border-b border-slate-100">
                                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                    Tugas Pokok
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 text-sm leading-relaxed text-slate-700 space-y-3">
                                <p>
                                    Inspektorat Daerah Kabupaten Rokan Hilir mempunyai tugas pokok <strong>membantu Bupati dalam membina dan mengawasi pelaksanaan urusan pemerintahan</strong> yang menjadi kewenangan Daerah dan tugas pembantuan oleh Perangkat Daerah serta Pemerintahan Desa / Kepenghuluan.
                                </p>
                                <p>
                                    Dalam melaksanakan tugas pokoknya, Inspektorat Daerah bertanggung jawab langsung kepada <strong>Bupati melalui Sekretaris Daerah</strong>, serta menyampaikan laporan hasil pengawasan secara berkala kepada Gubernur sebagai Wakil Pemerintah Pusat.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="bg-slate-50/80 border-b border-slate-100">
                                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <Layers className="h-5 w-5 text-emerald-600" />
                                    Fungsi Utama Pengawasan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 text-sm leading-relaxed text-slate-700">
                                <ul className="space-y-2.5">
                                    {[
                                        'Perumusan kebijakan teknis bidang pengawasan dan fasilitasi pengawasan daerah.',
                                        'Pelaksanaan pengawasan internal terhadap kinerja dan keuangan melalui audit, reviu, evaluasi, dan pemantauan.',
                                        'Pelaksanaan pengawasan dengan tujuan tertentu (PDTT) atas penugasan Kepala Daerah.',
                                        'Pemeriksaan atas pengelolaan keuangan Desa/Kepenghuluan dan pembinaan aparatur desa.',
                                        'Pengawalan tindak lanjut rekomendasi hasil pemeriksaan BPK-RI dan hasil pengawasan internal (TLHP).',
                                        'Pelaksanaan koordinasi pencegahan tindak pidana korupsi dan reformasi birokrasi.',
                                    ].map((f, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <ChevronRight className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* 3. Struktur Organisasi */}
                <section id="struktur" className="scroll-mt-36">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-100 text-blue-800">
                            <Users className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                Struktur Organisasi Pengawasan
                            </h2>
                            <p className="text-sm text-slate-600">Unit kerja pengawasan dan distribusi wilayah pembinaan APIP</p>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {strukturOrganisasi.map((unit, idx) => {
                            const isHighlight = unit.level === 'irban-highlight';
                            const isPrimary = unit.level === 'primary';
                            return (
                                <Card
                                    key={idx}
                                    className={`transition duration-200 hover:shadow-md ${
                                        isHighlight
                                            ? 'border-2 border-emerald-500 bg-emerald-50/40'
                                            : isPrimary
                                            ? 'border-2 border-slate-800 bg-slate-900 text-white sm:col-span-2 lg:col-span-3'
                                            : 'border-slate-200 bg-white'
                                    }`}
                                >
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between gap-2">
                                            <Badge
                                                variant={isPrimary ? 'outline' : 'secondary'}
                                                className={
                                                    isPrimary
                                                        ? 'border-[#f5c451] text-[#f5c451]'
                                                        : isHighlight
                                                        ? 'bg-emerald-600 text-white'
                                                        : 'bg-slate-100 text-slate-700'
                                                }
                                            >
                                                {unit.status}
                                            </Badge>
                                            {isHighlight && (
                                                <Badge className="bg-[#f5c451] text-[#064027] font-bold text-[10px]">
                                                    KKA Core
                                                </Badge>
                                            )}
                                        </div>
                                        <CardTitle className={`text-base font-bold ${isPrimary ? 'text-white text-lg' : 'text-slate-900'}`}>
                                            {unit.jabatan}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className={`text-xs sm:text-sm leading-relaxed ${isPrimary ? 'text-slate-300' : 'text-slate-600'}`}>
                                            {unit.deskripsi}
                                        </p>
                                        {unit.sub && (
                                            <div className="mt-3 flex flex-wrap gap-1.5 border-t border-slate-100 pt-2.5">
                                                {unit.sub.map((s, sIdx) => (
                                                    <span key={sIdx} className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </section>

                {/* 4. Nilai-Nilai Kode Etik APIP */}
                <section id="kodeetik" className="scroll-mt-36">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-100 text-purple-800">
                            <Award className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                Kode Etik & Nilai Dasar APIP (AAIPI)
                            </h2>
                            <p className="text-sm text-slate-600">Prinsip dasar kepribadian dan perilaku auditor intern pemerintah</p>
                        </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {nilaiKodeEtik.map((nilai, idx) => {
                            const Icon = nilai.ikon;
                            return (
                                <Card key={idx} className="border-slate-200 bg-white shadow-sm transition hover:border-emerald-300 hover:shadow-md">
                                    <CardHeader className="pb-2">
                                        <div className="mb-2 grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-[#0e6b3f]">
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <CardTitle className="text-lg font-bold text-slate-900">
                                            {nilai.judul}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm leading-relaxed text-slate-600">
                                            {nilai.deskripsi}
                                        </p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
