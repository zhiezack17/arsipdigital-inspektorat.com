{
  "brand_attributes": [
    "modern-formal",
    "profesional",
    "trustworthy",
    "terorganisir",
    "aman (security-forward)"
  ],
  "design_personality": {
    "north_star": "Portal terpusat yang terasa resmi seperti situs pemerintah, namun lebih modern: whitespace lega, kartu rapi, tipografi tegas, aksen hijau–biru dengan sentuhan emas yang hemat.",
    "layout_principles": [
      "F-pattern reading: kiri untuk identitas & navigasi, kanan untuk aksi cepat",
      "Progressive disclosure: detail admin & tabel panjang di halaman khusus, bukan menumpuk di dashboard",
      "Konsistensi grid 12 kolom (desktop) + 4 kolom (mobile) dengan spacing berbasis 8px"
    ],
    "visual_metaphors": [
      "Dokumen & arsip: garis tipis, divider halus, kartu seperti map dokumen",
      "Keamanan: badge status, ring focus jelas, warna semantic ketat"
    ]
  },
  "typography": {
    "google_fonts": {
      "heading": {
        "family": "Space Grotesk",
        "weights": [500, 600, 700],
        "usage": "Judul halaman, heading section, angka KPI"
      },
      "body": {
        "family": "Manrope",
        "weights": [400, 500, 600],
        "usage": "Body text, label form, tabel, berita"
      }
    },
    "tailwind_font_setup": {
      "instructions": [
        "Tambahkan import Google Fonts di index.html (atau via CSS @import) untuk Space Grotesk + Manrope.",
        "Set font default body ke Manrope, heading menggunakan utility class font-heading (di-extend pada tailwind.config.js) atau langsung className=\"font-[Space_Grotesk]\" jika belum ada token."
      ]
    },
    "text_size_hierarchy": {
      "h1": "text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight",
      "h2": "text-base md:text-lg font-medium text-muted-foreground",
      "section_title": "text-lg sm:text-xl font-semibold",
      "kpi_number": "text-2xl sm:text-3xl font-semibold tabular-nums",
      "body": "text-sm sm:text-base leading-6",
      "small": "text-xs sm:text-sm text-muted-foreground"
    }
  },
  "color_system": {
    "notes": [
      "Mengikuti permintaan: hijau (Rokan Hilir) + biru/emas (Inspektorat).",
      "Gradien hanya untuk background hero/ornamen (maks 20% viewport).",
      "Konten baca (kartu, tabel, berita) wajib solid background untuk keterbacaan."
    ],
    "palette_hex": {
      "brand_green": "#0F766E",
      "brand_green_2": "#0B5F58",
      "brand_blue": "#1E3A8A",
      "brand_blue_2": "#0B2A5B",
      "brand_gold": "#C8A24A",
      "brand_gold_soft": "#E7D7A6",
      "ink": "#0B1220",
      "muted_ink": "#334155",
      "surface": "#FFFFFF",
      "surface_2": "#F7FAFC",
      "border": "#E5E7EB",
      "success": "#15803D",
      "warning": "#B45309",
      "danger": "#B91C1C",
      "info": "#0369A1"
    },
    "shadcn_hsl_tokens": {
      "instructions": "Update /app/frontend/src/index.css :root dan .dark agar primary/secondary/accent mengikuti brand. Gunakan HSL agar konsisten dengan shadcn.",
      "light": {
        "--background": "210 40% 98%",
        "--foreground": "222 47% 11%",
        "--card": "0 0% 100%",
        "--card-foreground": "222 47% 11%",
        "--popover": "0 0% 100%",
        "--popover-foreground": "222 47% 11%",
        "--primary": "174 78% 26%",
        "--primary-foreground": "0 0% 98%",
        "--secondary": "210 40% 96%",
        "--secondary-foreground": "222 47% 11%",
        "--muted": "210 40% 96%",
        "--muted-foreground": "215 16% 35%",
        "--accent": "214 84% 56%",
        "--accent-foreground": "0 0% 98%",
        "--border": "214 32% 91%",
        "--input": "214 32% 91%",
        "--ring": "174 78% 26%",
        "--destructive": "0 72% 51%",
        "--destructive-foreground": "0 0% 98%",
        "--radius": "0.75rem"
      },
      "dark": {
        "--background": "222 47% 7%",
        "--foreground": "210 40% 98%",
        "--card": "222 47% 9%",
        "--card-foreground": "210 40% 98%",
        "--popover": "222 47% 9%",
        "--popover-foreground": "210 40% 98%",
        "--primary": "174 70% 40%",
        "--primary-foreground": "222 47% 11%",
        "--secondary": "222 47% 14%",
        "--secondary-foreground": "210 40% 98%",
        "--muted": "222 47% 14%",
        "--muted-foreground": "215 20% 70%",
        "--accent": "214 84% 60%",
        "--accent-foreground": "222 47% 11%",
        "--border": "222 47% 18%",
        "--input": "222 47% 18%",
        "--ring": "174 70% 40%",
        "--destructive": "0 62% 35%",
        "--destructive-foreground": "210 40% 98%"
      }
    },
    "allowed_gradients": {
      "hero_background_only": [
        "linear-gradient(135deg, rgba(15,118,110,0.10) 0%, rgba(30,58,138,0.08) 55%, rgba(200,162,74,0.10) 100%)",
        "radial-gradient(900px circle at 10% 0%, rgba(15,118,110,0.14), transparent 55%), radial-gradient(700px circle at 90% 10%, rgba(30,58,138,0.10), transparent 60%)"
      ],
      "divider_accent": "linear-gradient(90deg, rgba(15,118,110,0.0), rgba(15,118,110,0.35), rgba(200,162,74,0.25), rgba(30,58,138,0.0))"
    },
    "texture": {
      "noise_overlay_css": ".noise-overlay{position:absolute;inset:0;pointer-events:none;opacity:.06;background-image:url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"120\" height=\"120\"><filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"3\" stitchTiles=\"stitch\"/></filter><rect width=\"120\" height=\"120\" filter=\"url(%23n)\" opacity=\"0.35\"/></svg>');}"
    }
  },
  "spacing_and_layout": {
    "spacing_scale_px": [4, 8, 12, 16, 24, 32, 40, 48, 64],
    "container": {
      "max_width": "max-w-6xl (desktop), max-w-7xl jika tabel admin padat",
      "padding": "px-4 sm:px-6 lg:px-8",
      "section_spacing": "py-6 sm:py-8"
    },
    "grid": {
      "dashboard": "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
      "menu_cards": "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
      "admin_pages": "grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]"
    }
  },
  "header_dual_logo_treatment": {
    "structure": {
      "left": "Logo Kabupaten Rokan Hilir (lebih dominan) + nama portal",
      "right": "Logo Inspektorat (Anggaraksa Dharma) + user menu (avatar/dropdown)"
    },
    "alignment_rules": [
      "Gunakan container flex items-center justify-between.",
      "Kedua logo berada pada baseline yang sama; tinggi visual disamakan (mis. h-10 untuk keduanya) namun boleh beda lebar.",
      "Tambahkan separator vertikal tipis di antara dua blok identitas jika keduanya diletakkan berdekatan.",
      "Pada mobile: stack menjadi 2 baris (logo kabupaten + portal title di atas, logo inspektorat + user menu di bawah) untuk menghindari logo mengecil berlebihan."
    ],
    "recommended_classes": {
      "header": "sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      "logo_img": "h-10 w-auto object-contain",
      "logo_wrap": "flex items-center gap-3",
      "portal_title": "font-semibold tracking-tight",
      "portal_subtitle": "text-xs text-muted-foreground"
    },
    "accessibility": {
      "alt_text": [
        "alt=\"Logo Kabupaten Rokan Hilir\"",
        "alt=\"Logo Inspektorat Kabupaten Rokan Hilir - Anggaraksa Dharma\""
      ]
    }
  },
  "components": {
    "component_path": {
      "layout": [
        "/app/frontend/src/components/ui/navigation-menu.jsx",
        "/app/frontend/src/components/ui/breadcrumb.jsx",
        "/app/frontend/src/components/ui/separator.jsx",
        "/app/frontend/src/components/ui/sheet.jsx"
      ],
      "forms": [
        "/app/frontend/src/components/ui/form.jsx",
        "/app/frontend/src/components/ui/input.jsx",
        "/app/frontend/src/components/ui/label.jsx",
        "/app/frontend/src/components/ui/button.jsx",
        "/app/frontend/src/components/ui/checkbox.jsx"
      ],
      "content": [
        "/app/frontend/src/components/ui/card.jsx",
        "/app/frontend/src/components/ui/badge.jsx",
        "/app/frontend/src/components/ui/table.jsx",
        "/app/frontend/src/components/ui/tabs.jsx",
        "/app/frontend/src/components/ui/pagination.jsx",
        "/app/frontend/src/components/ui/scroll-area.jsx",
        "/app/frontend/src/components/ui/skeleton.jsx"
      ],
      "overlays": [
        "/app/frontend/src/components/ui/dialog.jsx",
        "/app/frontend/src/components/ui/alert-dialog.jsx",
        "/app/frontend/src/components/ui/tooltip.jsx",
        "/app/frontend/src/components/ui/popover.jsx",
        "/app/frontend/src/components/ui/dropdown-menu.jsx"
      ],
      "feedback": [
        "/app/frontend/src/components/ui/sonner.jsx"
      ]
    },
    "button_system": {
      "style": "Professional / Corporate dengan radius medium (8–12px) + elevasi halus.",
      "variants": {
        "primary": "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring",
        "secondary": "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        "ghost": "hover:bg-accent/10 text-foreground",
        "danger": "bg-destructive text-destructive-foreground hover:bg-destructive/90"
      },
      "sizes": {
        "sm": "h-9 px-3 text-sm",
        "md": "h-10 px-4 text-sm",
        "lg": "h-11 px-5 text-base"
      },
      "micro_interaction": "Hover: naik 1px (translate-y-[-1px]) + shadow-sm; Active: scale-95; jangan gunakan transition-all."
    },
    "card_system": {
      "base": "rounded-xl border bg-card text-card-foreground shadow-[0_1px_0_rgba(15,23,42,0.04)]",
      "hover": "hover:shadow-[0_10px_30px_rgba(2,6,23,0.08)] hover:-translate-y-0.5",
      "kpi_card": "p-4 sm:p-5",
      "menu_card": "p-4 sm:p-5 cursor-pointer",
      "news_card": "p-4"
    },
    "badges": {
      "aktif": "bg-emerald-50 text-emerald-700 border border-emerald-200",
      "segera_hadir": "bg-amber-50 text-amber-800 border border-amber-200",
      "admin": "bg-sky-50 text-sky-700 border border-sky-200"
    }
  },
  "page_blueprints": {
    "login": {
      "layout": [
        "Split layout desktop: kiri panel informasi (nama portal + aturan akses), kanan form.",
        "Mobile: single column, form dulu, info ringkas di bawah."
      ],
      "components": ["Card", "Form", "Input", "Button", "Checkbox"],
      "copy_guidance": [
        "Bahasa Indonesia formal: \"Masuk\", \"Nama Pengguna\", \"Kata Sandi\", \"Lupa kata sandi? Hubungi Admin\".",
        "Tambahkan helper text keamanan: \"Jangan bagikan kata sandi Anda.\""
      ],
      "testids": [
        "login-username-input",
        "login-password-input",
        "login-submit-button",
        "login-error-text"
      ]
    },
    "dashboard": {
      "header": [
        "Header sticky dengan dua logo + nama portal + user dropdown.",
        "Tambahkan breadcrumb kecil di bawah header untuk konteks (Dashboard)."
      ],
      "welcome_banner": {
        "style": "Card besar dengan background gradient lembut + noise overlay (maks 20% viewport).",
        "content": [
          "Judul: \"Selamat Datang di Portal Arsip Digital\"",
          "Subjudul: \"Inspektorat Kabupaten Rokan Hilir\"",
          "CTA kecil: \"Lihat Pengumuman Terbaru\" (scroll to section)"
        ],
        "testids": ["dashboard-welcome-banner", "dashboard-scroll-announcements-button"]
      },
      "stats": {
        "layout": "4 kartu KPI dalam grid (1 col mobile, 2 col tablet, 4 col desktop).",
        "kpis": [
          "Total Surat Masuk",
          "Total Surat Keluar",
          "Total Arsip",
          "Total Auditor Aktif"
        ],
        "testids": [
          "kpi-total-surat-masuk",
          "kpi-total-surat-keluar",
          "kpi-total-arsip",
          "kpi-total-auditor-aktif"
        ]
      },
      "menu_grid": {
        "cards": [
          "E-Arsip Irban I (Aktif)",
          "E-Arsip Irban II (Segera Hadir)",
          "E-Arsip Irban III (Segera Hadir)",
          "E-Arsip Irban IV (Aktif)",
          "E-Arsip Irban V (Segera Hadir)",
          "KKA (Aktif)"
        ],
        "interaction": [
          "Aktif: klik membuka subdomain di tab baru + konfirmasi ringan via tooltip (opsional).",
          "Segera Hadir: disabled state + tooltip \"Aplikasi sedang dipersiapkan\"."
        ],
        "testids": [
          "app-card-irban-1",
          "app-card-irban-2",
          "app-card-irban-3",
          "app-card-irban-4",
          "app-card-irban-5",
          "app-card-kka"
        ]
      },
      "news": {
        "layout": "2 kolom desktop: kiri feed berita (lebih lebar), kanan panel ringkas (mis. tautan cepat / kontak admin). Mobile: 1 kolom.",
        "components": ["Card", "Badge", "Separator", "Pagination"],
        "testids": ["news-feed", "news-item-card", "news-open-detail-button"]
      },
      "footer": {
        "content": [
          "Alamat kantor / kontak",
          "Hak cipta",
          "Versi aplikasi"
        ],
        "style": "Solid background (surface_2) + border-top; tanpa gradient."
      }
    },
    "news_detail": {
      "pattern": "Gunakan Dialog untuk detail cepat dari dashboard; gunakan route /news/:id untuk halaman penuh (lebih baik untuk share/print).",
      "components": ["Dialog", "ScrollArea"],
      "testids": ["news-detail-dialog", "news-detail-title", "news-detail-content"]
    },
    "admin": {
      "global_layout": [
        "Sidebar kiri (desktop) menggunakan NavigationMenu / custom list + Sheet untuk mobile.",
        "Konten kanan: header halaman + actions (Tambah, Simpan) + tabel/form."
      ],
      "users": {
        "components": ["Table", "Dialog", "AlertDialog", "Form", "Input", "Select"],
        "testids": [
          "admin-users-table",
          "admin-users-create-button",
          "admin-users-edit-button",
          "admin-users-delete-button"
        ]
      },
      "news": {
        "components": ["Table", "Dialog", "Textarea", "Input", "Button"],
        "testids": [
          "admin-news-table",
          "admin-news-create-button",
          "admin-news-publish-toggle"
        ]
      },
      "stats": {
        "components": ["Card", "Form", "Input", "Button"],
        "testids": ["admin-stats-form", "admin-stats-save-button"]
      },
      "links": {
        "components": ["Card", "Form", "Input", "Button"],
        "testids": ["admin-links-form", "admin-links-save-button"]
      }
    },
    "profile": {
      "layout": "Card terpusat secara visual tapi tetap align kiri untuk teks; gunakan max-w-lg.",
      "components": ["Form", "Input", "Button"],
      "fields": ["Password Lama", "Password Baru", "Konfirmasi Password Baru"],
      "testids": [
        "profile-old-password-input",
        "profile-new-password-input",
        "profile-confirm-password-input",
        "profile-save-password-button"
      ]
    }
  },
  "iconography": {
    "library": "lucide-react",
    "rules": [
      "Gunakan 1 gaya ikon konsisten (outline).",
      "Ukuran default 18–20px untuk tombol/menu; 24px untuk kartu menu.",
      "Ikon selalu ditemani label teks (hindari ikon-only untuk aksi penting)."
    ],
    "suggested_icons": {
      "surat_masuk": "Inbox",
      "surat_keluar": "Send",
      "total_arsip": "Archive",
      "auditor": "Users",
      "berita": "Newspaper",
      "tautan": "ExternalLink",
      "admin": "Shield",
      "profil": "User"
    }
  },
  "motion_and_microinteractions": {
    "library": {
      "recommended": "framer-motion",
      "install": "npm i framer-motion",
      "usage": [
        "Gunakan untuk entrance halus: fade + y 8px pada banner, KPI cards, menu grid.",
        "Gunakan reduced motion: hormati prefers-reduced-motion (disable animasi besar)."
      ]
    },
    "principles": [
      "Durasi 160–220ms untuk hover/press.",
      "Easing: cubic-bezier(0.2, 0.8, 0.2, 1).",
      "Hover kartu: shadow naik + translateY kecil.",
      "Loading: gunakan Skeleton untuk KPI & feed berita."
    ]
  },
  "dark_light_mode_strategy": {
    "default": "Light mode sebagai default (lebih sesuai portal pemerintah).",
    "dark_mode": [
      "Sediakan toggle di user dropdown.",
      "Pastikan badge status tetap terbaca (gunakan background lebih gelap + text lebih terang).",
      "Hindari gradient gelap; gunakan solid dark surfaces."
    ],
    "testids": ["theme-toggle-button"]
  },
  "accessibility": {
    "wcag": [
      "Kontras teks minimal WCAG AA.",
      "Focus ring wajib terlihat (gunakan ring color primary).",
      "Ukuran target sentuh minimal 44px untuk tombol utama di mobile.",
      "Tabel admin: header jelas, gunakan Table shadcn + aria-label pada aksi."
    ]
  },
  "data_testid_policy": {
    "rule": "Semua elemen interaktif & informasi kunci wajib punya data-testid (kebab-case).",
    "examples": [
      "dashboard-app-open-irban-1-button",
      "admin-news-save-button",
      "header-user-menu-trigger",
      "announcement-item-title"
    ]
  },
  "image_urls": {
    "note": "Tool image provider tidak mengembalikan hasil untuk query Indonesia. Gunakan aset internal institusi (foto kantor resmi, kegiatan audit) atau placeholder netral (solid/illustration) sampai aset resmi tersedia.",
    "recommended_categories": [
      {
        "category": "hero_banner_background",
        "description": "Gunakan background abstrak (SVG) + noise overlay; hindari foto jika belum ada izin publikasi.",
        "urls": []
      },
      {
        "category": "news_thumbnails",
        "description": "Gunakan foto kegiatan resmi (rapat, audit lapangan) dari dokumentasi humas; crop 16:9.",
        "urls": []
      },
      {
        "category": "login_side_panel",
        "description": "Ilustrasi dokumen/arsip (SVG) atau foto gedung kantor (resmi).",
        "urls": []
      }
    ]
  },
  "implementation_notes_js": {
    "react_files": "Project menggunakan .js/.jsx (bukan .tsx). Pastikan contoh kode dan komponen mengikuti JS.",
    "routing": "Gunakan react-router-dom untuk route /login, /dashboard, /admin/*, /profile.",
    "external_links": "Menu aplikasi subdomain gunakan <a target=\"_blank\" rel=\"noreferrer\"> dengan Button/Card clickable."
  },
  "instructions_to_main_agent": [
    "Update token warna shadcn di /app/frontend/src/index.css sesuai HSL tokens di atas.",
    "Hapus styling default CRA di App.css yang membuat background gelap dan center layout; gunakan Tailwind layout.",
    "Implement header dual-logo sesuai aturan alignment; pastikan responsive stacking di mobile.",
    "Bangun Dashboard: Welcome banner (gradient lembut + noise), KPI cards, menu grid 6 kartu dengan Badge status, feed berita.",
    "Admin pages: gunakan layout sidebar + content; tabel shadcn untuk user/news; form shadcn untuk stats/links.",
    "Tambahkan data-testid pada semua tombol, input, link subdomain, badge status, dan angka KPI.",
    "Tambahkan framer-motion untuk micro-interactions (opsional tapi direkomendasikan) dan hormati prefers-reduced-motion.",
    "Pastikan bahasa Indonesia formal konsisten di seluruh UI (label, tombol, empty state, error)."
  ],
  "general_ui_ux_design_guidelines_appendix": "<General UI UX Design Guidelines>  \n    - You must **not** apply universal transition. Eg: `transition: all`. This results in breaking transforms. Always add transitions for specific interactive elements like button, input excluding transforms\n    - You must **not** center align the app container, ie do not add `.App { text-align: center; }` in the css file. This disrupts the human natural reading flow of text\n   - NEVER: use AI assistant Emoji characters like`🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇 etc for icons. Always use **FontAwesome cdn** or **lucid-react** library already installed in the package.json\n\n **GRADIENT RESTRICTION RULE**\nNEVER use dark/saturated gradient combos (e.g., purple/pink) on any UI element.  Prohibited gradients: blue-500 to purple 600, purple 500 to pink-500, green-500 to blue-500, red to pink etc\nNEVER use dark gradients for logo, testimonial, footer etc\nNEVER let gradients cover more than 20% of the viewport.\nNEVER apply gradients to text-heavy content or reading areas.\nNEVER use gradients on small UI elements (<100px width).\nNEVER stack multiple gradient layers in the same viewport.\n\n**ENFORCEMENT RULE:**\n    • Id gradient area exceeds 20% of viewport OR affects readability, **THEN** use solid colors\n\n**How and where to use:**\n   • Section backgrounds (not content backgrounds)\n   • Hero section header content. Eg: dark to light to dark color\n   • Decorative overlays and accent elements only\n   • Hero section with 2-3 mild color\n   • Gradients creation can be done for any angle say horizontal, vertical or diagonal\n\n- For AI chat, voice application, **do not use purple color. Use color like light green, ocean blue, peach orange etc**\n\n</Font Guidelines>\n\n- Every interaction needs micro-animations - hover states, transitions, parallax effects, and entrance animations. Static = dead. \n   \n- Use 2-3x more spacing than feels comfortable. Cramped designs look cheap.\n\n- Subtle grain textures, noise overlays, custom cursors, selection states, and loading animations: separates good from extraordinary.\n   \n- Before generating UI, infer the visual style from the problem statement (palette, contrast, mood, motion) and immediately instantiate it by setting global design tokens (primary, secondary/accent, background, foreground, ring, state colors), rather than relying on any library defaults. Don't make the background dark as a default step, always understand problem first and define colors accordingly\n    Eg: - if it implies playful/energetic, choose a colorful scheme\n           - if it implies monochrome/minimal, choose a black–white/neutral scheme\n\n**Component Reuse:**\n\t- Prioritize using pre-existing components from src/components/ui when applicable\n\t- Create new components that match the style and conventions of existing components when needed\n\t- Examine existing components to understand the project's component patterns before creating new ones\n\n**IMPORTANT**: Do not use HTML based component like dropdown, calendar, toast etc. You **MUST** always use `/app/frontend/src/components/ui/ ` only as a primary components as these are modern and stylish component\n\n**Best Practices:**\n\t- Use Shadcn/UI as the primary component library for consistency and accessibility\n\t- Import path: ./components/[component-name]\n\n**Export Conventions:**\n\t- Components MUST use named exports (export const ComponentName = ...)\n\t- Pages MUST use default exports (export default function PageName() {...})\n\n**Toasts:**\n  - Use `sonner` for toasts\"\n  - Sonner component are located in `/app/src/components/ui/sonner.tsx`\n\nUse 2–4 color gradients, subtle textures/noise overlays, or CSS-based noise to avoid flat visuals.\n</General UI UX Design Guidelines>"
}
