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
  // Timer Actions
  START_TIMER: 'START_TIMER',
  STOP_TIMER: 'STOP_TIMER',
  // Live Reaction (Fitur 4)
  SEND_REACTION: 'SEND_REACTION',
  // Ping/Pong untuk heartbeat koneksi
  PING: 'PING',
  PONG: 'PONG',
};

export const ROLES = {
  HOST: 'HOST',
  VOTER: 'VOTER',
  SPECTATOR: 'SPECTATOR',
};

