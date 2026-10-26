# Project Rules & Workspace Directives

## 1. Aturan Wajib (Mandatory Governing Rules)
Setiap tugas rekayasa kode, modifikasi file, penambahan komponen, maupun perancangan UI di workspace ini **wajib dan mutlak mematuhi dua dokumen resmi berikut**:

1. **Clean Code Guidelines**: [`clean-code.md`](./clean-code.md)
2. **Design System & Anti-Slop Directives**: [`design.md`](./design.md)

---

## 2. Intisari Aturan yang Selalu Berlaku (Always-On Directives)

### Rekayasa Kode (Clean Code)
- **Separation of Concerns**: Komponen UI tidak boleh mengelola instance WebRTC/PeerJS langsung. Semua koneksi dan sinkronisasi wajib diisolasi di custom hooks (seperti `usePeer`, `usePokerSession`).
- **Single Responsibility (SRP)**: Pecah komponen besar menjadi sub-komponen kecil yang fokus (misal memisahkan daftar kartu, header, dan meja partisipan).
- **State Management**:
  - Hindari state duplikat / turunan di `useState`. Hitung nilai seperti rata-rata poin (*average*) langsung saat render menggunakan `useMemo`.
  - Selalu gunakan functional updater untuk state array/object (`setList(prev => [...prev, item])`).
- **Pembersihan Wajib**: Setiap listener WebRTC, timer, atau subscription di `useEffect` wajib menyertakan fungsi cleanup (`return () => peer.destroy()`).
- **Guard Clauses**: Tangani error state dan loading state di baris paling atas fungsi komponen dengan early return.

### Desain & UI/UX (Design Taste)
- **Design Read**: *Web application / real-time collaboration tool for engineering and agile product teams, with a Linear-style focused, high-clarity minimalist language, leaning toward Tailwind utilities + Phosphor Icons + restrained tactile motion.*
- **Dial Setting**: `DESIGN_VARIANCE: 5`, `MOTION_INTENSITY: 4`, `VISUAL_DENSITY: 4`.
- **Palet Warna**: Basis *Dark Zinc* (`zinc-950` / `zinc-900`, border `zinc-800`) dipadukan dengan 1 aksen tunggal: **Electric Indigo** (`#6366f1`). Dilarang menggunakan gradien ungu AI klise.
- **Ikon**: Wajib menggunakan `@phosphor-icons/react` dengan `weight="regular"` terstandar. Dilarang mencampur pustaka ikon lain.
- **Konsistensi Bentuk**: Seluruh komponen interaktif menggunakan radius terstandarisasi (`rounded-xl` untuk kartu & modal kontainer, `rounded-lg` untuk tombol & input).
- **Aturan Em-Dash**: Dilarang keras menggunakan karakter em-dash (tanda strip panjang U+2014) di seluruh tampilan teks, tombol, alt text, komentar kode, maupun log sistem.

