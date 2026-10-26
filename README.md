# Scrum Poker Realtime (P2P Story Point Estimator)

Aplikasi Scrum Poker / Planning Poker modern, ringan, dan interaktif yang berjalan 100% di browser via **WebRTC (PeerJS)**. Dirancang khusus untuk tim rekayasa perangkat lunak dan produk agile agar proses estimasi sprint berjalan cepat, seru, transparan, dan tanpa hambatan registrasi akun.

Aplikasi ini siap di-deploy langsung ke **Vercel** dengan arsitektur Static Single Page Application (SPA).

---

## 🚀 Fitur Utama

### 1. Arsitektur Real-time P2P (Zero Setup & Bebas Biaya)
* **WebRTC Data Channels via PeerJS**: Komunikasi data langsung antar browser dengan latensi sangat rendah.
* **Tanpa Backend / Database Eksternal**: Tidak memerlukan registrasi akun, server WebSocket tersendiri, maupun setup API key.
* **Topologi Star**: Host (Scrum Master) bertindak sebagai koordinator sesi, rekan tim tersambung sebagai peer.

### 2. Manajemen Ruangan & Tautan Berbagi
* **ID Room Kustom**: Pembuat room dapat menentukan ID kustom sendiri (contoh: `sprint-be-14`) atau menggunakan fitur **Acak ID**.
* **Deteksi & Penolakan ID Duplikat**: Jika Room ID sudah digunakan oleh Host lain yang aktif, sistem otomatis menolak dan memandu Host memilih ID lain.
* **Tautan Satu-Klik**: Tombol salin link instan (`/?room=KODE_ROOM`) untuk dibagikan di Slack, WhatsApp, atau Microsoft Teams.
* **Anti-Keluar saat Refresh**: Sesi aktif tersimpan di `sessionStorage`, sehingga me-refresh halaman tidak akan membuat pemain terlempar keluar dari room.

### 3. Galeri Karakter Wajah Tim (7 Avatar)
* Tim dapat memilih foto wajah karakter kocak saat masuk ke ruangan.
* Foto wajah terpampang di meja poker dengan cincin status interaktif:
  * Status *"Pikir..."* saat voter masih mempertimbangkan poin.
  * Cincin bercahaya dengan centang hijau *"Siap"* saat kartu sudah dipilih.
  * Kartu 3D berputar halus (*flip animation*) saat Host membuka kartu.

### 4. Sorotan Debat Estimasi (Min vs Max)
* Jika terdapat perbedaan angka estimasi saat kartu dibuka, sistem otomatis memunculkan panel sorotan antara pemilih angka terendah vs tertinggi.
* **Giliran Bicara Diacak**: Sistem memilih secara adil siapa yang berbicara pertama (50% peluang untuk estimasi terendah atau tertinggi).
* Tombol **"Kocok Giliran"** untuk mengundi ulang urutan pembicara.

### 5. Timer Hitung Mundur Sesi (Host-Controlled)
* Host dapat memicu timer dengan pilihan durasi:
  * **Preset Cepat**: `30d`, `60d`, `90d`, `5m`, `10m`, dan `1 jam`.
  * **Kustom**: Input bebas angka menit atau detik.
* Efek suara detikan lembut (*tick*) pada 5 detik terakhir dan nada peringatan waktu habis.

### 6. Efek Suara Taktil & Celotehan Lucu per Emoji
* Menggunakan sintesis audio murni **Web Audio API** dan **Web Speech Synthesis (Bahasa Indonesia)** tanpa membutuhkan file MP3 eksternal.
* Setiap kali emoji reaksi diklik, emoji melayang naik di layar semua orang dan mengeluarkan suara lucu khas:
  * `☕` (Kopi): Efek sruput air + *"Ngopi dulu bro!"* / *"Srupuuut! Santai dulu gak sih"*.
  * `🔥` (Api): Efek laser menyala + *"Menyala abangku!"* / *"Gokil panas membara!"*.
  * `💀` (Tengkorak): Efek bonk kartun + *"Waduh beban sprint!"* / *"Tidur aja udah tidur"*.
  * `🚀` (Roket): Efek roket meluncur + *"Gaskeun jangan kasih kendor!"* / *"Meluncur ke production!"*.
  * `🤔` (Mikir): Efek per membal (*boing*) + *"Hmm mencurigakan..."* / *"Overthinking dimulai nih"*.
  * `🎉` (Pesta): Efek terompet pesta + *"Mantap jiwa!"* / *"Gajian cair kawan-kawan!"*.
* Tersedia tombol **Mute / Unmute** di navbar untuk mematikan suara sewaktu-waktu.

### 7. Riwayat Estimasi & Ekspor ke Jira / Linear
* Setiap kali Host menekan tombol **Putaran Baru**, tiket beserta nilai poin dan status konsensus otomatis terarsip ke tab **Riwayat**.
* **Salin Format Markdown**: Format tabel siap paste langsung ke tiket Jira, Linear, Notion, atau Slack.
* **Download CSV**: Unduh berkas `.csv` untuk arsip spreadsheet tim.

---

## 🛠️ Tech Stack & Konvensi Desain

* **Framework**: React 18 + Vite
* **Styling**: Tailwind CSS v4
* **Ikon**: `@phosphor-icons/react` (terstandarisasi)
* **Realtime Protocol**: PeerJS (WebRTC Data Channels)
* **Efek Visual**: Canvas Confetti (saat tercapai kesepakatan konsensus)
* **Audio Engine**: Web Audio API + Web Speech Synthesis
* **Kepatuhan Desain**:
  * Mengikuti pedoman antarmuka `design.md` (Dark Zinc `zinc-950` dengan aksen tunggal Electric Indigo `#6366f1`).
  * Mengikuti standar rekayasa kode `clean-code.md` (Pemisahan logika WebRTC di custom hook, penanganan early return, dan cleanup ketat).
  * Bersih dari karakter em-dash di seluruh tampilan teks, komentar, dan log sistem.

---

## 📁 Struktur Direktori Proyek

```
.
├── public/
│   └── avatars/              # Koleksi 7 foto wajah anggota tim
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx            # Header, status online, mute toggle, copy link
│   │   │   └── SessionHeader.jsx     # Topik tiket, timer bar, dan kontrol Host
│   │   ├── lobby/
│   │   │   ├── LobbyView.jsx         # Formulir Buat Room & Gabung Room
│   │   │   └── AvatarPicker.jsx      # Pemilih karakter foto tim
│   │   └── poker/
│   │       ├── CardItem.jsx          # Kartu 3D flip & avatar foto pemain
│   │       ├── ParticipantTable.jsx  # Meja bundar partisipan
│   │       ├── VotingDeck.jsx        # Pilihan kartu Fibonacci (0 s/d 21, ?, ☕)
│   │       ├── SummaryStats.jsx      # Perhitungan rata-rata, konsensus & suara terbanyak
│   │       ├── DebateSpotlight.jsx   # Sorotan debat nilai min vs max
│   │       ├── SessionTimer.jsx      # Komponen hitung mundur & suara detik
│   │       ├── LiveReactions.jsx     # Emoji reaksi melayang realtime
│   │       ├── SprintHistoryModal.jsx# Modal riwayat tiket & tombol ekspor
│   │       └── ConsensusCelebration.jsx # Animasi confetti konsensus
│   ├── constants/
│   │   ├── actions.js        # Protokol aksi pesan WebRTC
│   │   ├── avatars.js        # Data 7 karakter wajah tim
│   │   └── cards.js          # Nilai kartu deret Fibonacci
│   ├── hooks/
│   │   └── usePokerSession.js# Custom hook isolasi jaringan & state PeerJS
│   ├── utils/
│   │   ├── debate.js         # Logika pengacakan giliran bicara debat
│   │   ├── export.js         # Generator Markdown dan berkas CSV
│   │   ├── math.js           # Kalkulasi rata-rata, modus, dan konsensus
│   │   └── sound.js          # Web Audio Synthesizer & Speech Voice Lines
│   ├── App.jsx               # Routing sesi & penanganan refresh
│   ├── main.jsx              # Entry point aplikasi
│   └── index.css             # Konfigurasi Tailwind v4 & cursor pointer
├── vercel.json               # Konfigurasi rewrite SPA Vercel
├── package.json
└── vite.config.js
```

---

## 💻 Panduan Menjalankan di Lokal

### Prasyarat
* Node.js versi 18 atau yang lebih baru.
* npm versi 9 atau yang lebih baru.

### Langkah Instalasi
1. Clone repositori ini atau buka direktori proyek:
   ```bash
   cd KARTU
   ```
2. Instal seluruh dependensi:
   ```bash
   npm install
   ```
3. Jalankan server pengembangan lokal:
   ```bash
   npm run dev
   ```
4. Buka tautan di browser:
   ```
   http://localhost:5173
   ```

> **Tips Pengujian Real-time Lokal**: Buka dua tab browser (misal tab normal dan tab incognito) untuk menguji sinkronisasi voting, timer, dan reaksi suara secara langsung antar tab!

---

## ☁️ Panduan Deploy ke Vercel (1-Klik)

Proyek ini telah dikonfigurasi dengan berkas `vercel.json` sehingga dapat langsung di-deploy tanpa memerlukan backend serverless terpisah:

1. Buat repositori baru di akun GitHub Anda dan unggah seluruh berkas proyek:
   ```bash
   git remote add origin https://github.com/USERNAME/REPO_NAME.git
   git push -u origin main
   ```
2. Kunjungi dashboard [Vercel](https://vercel.com) dan klik **Add New Project**.
3. Hubungkan repositori GitHub Anda.
4. Pada bagian **Build and Output Settings**, biarkan default (Vite otomatis terdeteksi):
   * Build Command: `npm run build`
   * Output Directory: `dist`
5. Klik tombol **Deploy**.
6. Selesai! Website Scrum Poker Anda langsung aktif dan dapat langsung dibagikan link-nya ke tim kerja.

---

## 📜 Lisensi
Dilisensikan di bawah lisensi MIT. Bebas digunakan dan dimodifikasi untuk kebutuhan sprint planning tim Anda.
