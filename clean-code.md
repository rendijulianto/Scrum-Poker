# Clean Code Standards & Engineering Guidelines

Dokumen ini adalah aturan resmi rekayasa perangkat lunak untuk proyek ini. Setiap file, komponen, hook, dan logika yang ditulis **wajib** mematuhi aturan di bawah ini bersamaan dengan panduan visual di `design.md`.

---

## 1. Filosofi Utama (Core Philosophy)

1. **Readability First**: Kode dibaca jauh lebih sering daripada ditulis. Tulis kode yang mudah dipahami oleh rekan tim dalam sekali baca tanpa perlu menebak-nebak.
2. **KISS (Keep It Simple, Stupid)**: Hindari abstraksi berlebihan sebelum dibutuhkan. Jangan membuat layer arsitektur rumit jika fungsi sederhana sudah cukup.
3. **Single Responsibility Principle (SRP)**:
   - Satu file komponen hanya bertanggung jawab atas satu bagian tampilan visual atau interaksi tertentu.
   - Satu fungsi atau hook hanya melakukan satu hal dengan tuntas.
4. **Explicit over Implicit**: Aliran data harus jelas, transparan, dan dapat dilacak dari atas ke bawah.

---

## 2. Struktur Komponen & Pemisahan Logika (Separation of Concerns)

### A. Ekstraksi Hook untuk Logika Efek & Jaringan
- **UI Komponen Dilarang Mengelola WebRTC/Socket Langsung**: Komponen UI tidak boleh memanggil `new Peer()` atau event listener jaringan secara langsung di dalam body komponen.
- **Wajib Dikelola Lewat Custom Hook**: Seluruh siklus hidup koneksi PeerJS, pendaftaran listener data, dan state sinkronisasi harus dibungkus dalam custom hook (contoh: `usePeer`, `usePokerSession`).
- Komponen UI hanya menerima state siap pakai dan fungsi handler:
  ```jsx
  // BAIK: Bersih dan deklaratif
  export function PokerRoom({ roomId, userName, isHost }) {
    const { gameState, vote, revealCards, resetRound, error, isConnecting } = usePokerSession(roomId, userName, isHost);

    if (error) return <ConnectionErrorState error={error} />;
    if (isConnecting) return <ConnectingSkeleton />;

    return (
      <main className="min-h-[100dvh] flex flex-col justify-between">
        <SessionHeader topic={gameState.topic} isHost={isHost} />
        <ParticipantTable participants={gameState.participants} isRevealed={gameState.isRevealed} />
        <VotingDeck onSelectVote={vote} selectedVote={gameState.myVote} disabled={gameState.isRevealed} />
      </main>
    );
  }
  ```

### B. Dekomposisi Komponen Presentasional
- Pecah komponen besar menjadi sub-komponen kecil yang fokus.
- Setiap sub-komponen yang hanya bertugas menampilkan list atau kartu diekstrak ke fungsi/file terpisah.
- Contoh standar referensi:
  ```jsx
  // Sub-komponen murni (Presentational)
  function MessageList({ messages }) {
    return (
      <ul className="space-y-2">
        {messages.map((message) => (
          <li key={message.id}>{message.text}</li>
        ))}
      </ul>
    );
  }
  ```

---

## 3. Konvensi Penamaan (Naming Conventions)

| Tipe | Konvensi | Contoh Baik | Contoh Buruk |
| :--- | :--- | :--- | :--- |
| **Komponen & Tipe** | `PascalCase` | `PokerCard`, `ParticipantGrid`, `SessionHeader` | `card`, `participant_grid` |
| **Custom Hooks** | `camelCase` diawali `use` | `usePeer`, `useClipboard`, `usePokerSession` | `peerHook`, `session` |
| **Event Handlers** | Diawali `handle*` | `handleVoteSelect`, `handleRevealClick`, `handleTopicChange` | `onVote`, `clickBtn`, `doReveal` |
| **Props Callback** | Diawali `on*` | `onSelectVote`, `onReveal`, `onResetRound` | `handleVote`, `doChange` |
| **Boolean State** | Diawali `is*`, `has*`, `should*`, `can*` | `isRevealed`, `hasVoted`, `isHost`, `canReveal` | `revealed`, `voted`, `host` |
| **Array & Koleksi** | Jamak atau berakhiran `List` | `participants`, `messageList`, `cardOptions` | `participant`, `data`, `item` |
| **Fungsi Updater State** | Beri nama jelas pada nilai sebelumnya | `setParticipants(previous => [...previous, newPeer])` | `setParticipants(x => [...x, y])` |

---

## 4. Manajemen State & React Best Practices

1. **State Immutability**:
   - Selalu perbarui state secara immutable. Jangan pernah memutasi array atau object state secara langsung (`arr.push()` dilarang).
   - Gunakan updater function jika state baru bergantung pada state sebelumnya:
     ```jsx
     setMessageList((previousMessages) => [...previousMessages, newMessage]);
     ```

2. **Hindari State Duplikat / Redundan (Single Source of Truth)**:
   - Jangan simpan data yang bisa dihitung (*derived state*) ke dalam `useState`.
   - Contoh: Rata-rata story point tidak perlu disimpan di `useState(average)`. Hitung langsung saat render menggunakan helper function atau `useMemo`:
     ```jsx
     // BAIK: Dihitung langsung dari data peserta
     const averagePoints = useMemo(() => calculateAverage(participants), [participants]);
     ```

3. **Pembersihan Wajib pada `useEffect` (Cleanup Strictness)**:
   - Setiap listener WebRTC, koneksi PeerJS, interval waktu, atau timeout **harus** memiliki fungsi cleanup untuk mencegah *memory leak* dan duplikasi event.
     ```jsx
     useEffect(() => {
       const peer = new Peer(peerId, peerConfig);
       // ... registrasi listener

       return () => {
         peer.destroy(); // Wajib di-cleanup
       };
     }, [peerId]);
     ```

4. **Early Returns untuk State Khusus**:
   - Tangani kondisi error, loading, dan empty state di baris paling atas fungsi komponen (*guard clauses*).
     ```jsx
     if (peerError) {
       return <ErrorBanner message={peerError.message} />;
     }
     ```

---

## 5. Standar WebRTC & Realtime Resilience

1. **Pesan Terstruktur (Message Protocol)**:
   - Semua paket data WebRTC yang dikirimkan harus menggunakan format action terstandarisasi:
     ```ts
     type PeerAction = 
       | { type: 'VOTE'; payload: { peerId: string; card: string } }
       | { type: 'REVEAL' }
       | { type: 'RESET' }
       | { type: 'SYNC_STATE'; payload: RoomState }
       | { type: 'UPDATE_TOPIC'; payload: { topic: string } };
     ```
2. **Graceful Disconnection**:
   - Ketika ada peer yang menutup tab atau kehilangan koneksi, host harus mendeteksi event `close` / `error` dan menghapus peer tersebut dari daftar aktif secara mulus tanpa membuat app crash.

---

## 6. Penataan Folder Proyek (Modular Directory Layout)

```
src/
├── components/          # Komponen UI presentasional murni
│   ├── ui/              # Elemen dasar (Button, Card, Badge, Modal, Input)
│   ├── poker/           # Komponen spesifik domain (VotingDeck, CardItem, TableView)
│   └── layout/          # Navbar, Footer, Header
├── hooks/               # Custom hooks (usePeer, usePokerSession, useClipboard)
├── utils/               # Fungsi pembantu murni (kalkulasi nilai, format string)
├── types/               # Definisi tipe TypeScript / PropTypes
├── constants/           # Nilai kartu Fibonacci, konfigurasi default
├── App.jsx              # Routing / State peralihan Lobby & Room
└── main.jsx             # Entry point aplikasi
```

---

## 7. Checklist Kepatuhan Clean Code Sebelum Selesai

Setiap kali menyelesaikan penulisan atau perubahan kode, pastikan poin berikut terpenuhi:
- [ ] **Tidak ada baris kode mati / console.log sisa debug**.
- [ ] **Tidak ada logika jaringan/PeerJS yang bercampur di komponen UI murni**.
- [ ] **Semua `useEffect` yang membuka koneksi/listener memiliki fungsi cleanup**.
- [ ] **Nama variabel dan fungsi deskriptif serta konsisten** (`handle*`, `is*`, `use*`).
- [ ] **Bebas dari karakter em-dash** (tanda strip panjang U+2014) baik dalam string UI, komentar kode, maupun error log (sesuai `design.md`).
- [ ] **Error state dan loading state ditangani secara elegan dengan early return**.
