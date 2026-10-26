/**
 * Menghitung kandidat debat antara nilai estimasi terendah dan tertinggi.
 * Mengacak siapa yang mendapat giliran bicara pertama.
 */
export function getDebateSpotlight(participants) {
  const votersWithNumeric = participants
    .filter((p) => p.role !== 'SPECTATOR')
    .filter((p) => p.vote !== null && p.vote !== undefined && !isNaN(Number(p.vote)) && p.vote !== '?' && p.vote !== '☕')
    .map((p) => ({ ...p, numericVote: Number(p.vote) }));

  if (votersWithNumeric.length < 2) return null;

  // Cari nilai minimum dan maksimum
  const numericValues = votersWithNumeric.map((p) => p.numericVote);
  const minVal = Math.min(...numericValues);
  const maxVal = Math.max(...numericValues);

  // Jika semua orang memilih nilai yang sama persis, tidak perlu debat
  if (minVal === maxVal) return null;

  // Ambil kandidat min dan max
  const minCandidates = votersWithNumeric.filter((p) => p.numericVote === minVal);
  const maxCandidates = votersWithNumeric.filter((p) => p.numericVote === maxVal);

  // Pilih satu perwakilan secara acak jika ada lebih dari 1 orang di kubu min/max
  const minSpeaker = minCandidates[Math.floor(Math.random() * minCandidates.length)];
  const maxSpeaker = maxCandidates[Math.floor(Math.random() * maxCandidates.length)];

  // Acak siapa yang bicara lebih dulu (50% min duluan, 50% max duluan)
  const isMinFirst = Math.random() < 0.5;

  return {
    minVal,
    maxVal,
    minSpeaker,
    maxSpeaker,
    firstSpeakerId: isMinFirst ? minSpeaker.id : maxSpeaker.id,
  };
}

