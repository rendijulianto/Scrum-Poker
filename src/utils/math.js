/**
 * Menghitung rata-rata nilai poin dari daftar peserta.
 * Kartu non-angka ('?' atau '☕') diabaikan dalam perhitungan numerik.
 */
export function calculateAverage(participants) {
  const numericVotes = participants
    .map((p) => p.vote)
    .filter((v) => v !== null && v !== undefined && !isNaN(Number(v)) && v !== '?' && v !== '☕')
    .map((v) => Number(v));

  if (numericVotes.length === 0) return null;

  const total = numericVotes.reduce((sum, val) => sum + val, 0);
  const average = total / numericVotes.length;
  // Pembulatan ke 1 desimal jika bukan bilangan bulat
  return Math.round(average * 10) / 10;
}

/**
 * Menghitung distribusi pilihan suara.
 * Mengembalikan array: [{ value: '5', count: 3 }, ...] diurutkan dari count terbanyak.
 */
export function calculateDistribution(participants) {
  const voteCounts = {};

  participants.forEach((p) => {
    if (p.vote) {
      voteCounts[p.vote] = (voteCounts[p.vote] || 0) + 1;
    }
  });

  return Object.entries(voteCounts)
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Mengecek apakah tercapai konsensus suara bulat (semua voter memilih kartu yang persis sama).
 */
export function checkConsensus(participants) {
  const votersWithVotes = participants
    .filter((p) => p.role !== 'SPECTATOR')
    .map((p) => p.vote)
    .filter((v) => v !== null && v !== undefined);

  if (votersWithVotes.length < 2) return false;

  const firstVote = votersWithVotes[0];
  return votersWithVotes.every((v) => v === firstVote);
}
