export const PEER_ACTIONS = {
  // Anggota mengirim data join ke host
  JOIN: 'JOIN',
  // Host broadcast full state ke semua peer
  SYNC_STATE: 'SYNC_STATE',
  // Anggota mengirim vote ke host
  VOTE: 'VOTE',
  // Host mengumumkan buka kartu
  REVEAL: 'REVEAL',
  // Host mereset sesi untuk putaran berikutnya
  RESET: 'RESET',
  // Host memperbarui topik tiket
  UPDATE_TOPIC: 'UPDATE_TOPIC',
  // Ping/Pong untuk heartbeat koneksi
  PING: 'PING',
  PONG: 'PONG',
};

export const ROLES = {
  HOST: 'HOST',
  VOTER: 'VOTER',
  SPECTATOR: 'SPECTATOR',
};
