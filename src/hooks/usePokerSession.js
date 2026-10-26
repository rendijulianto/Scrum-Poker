import { useState, useEffect, useRef, useCallback } from 'react';
import Peer from 'peerjs';
import { PEER_ACTIONS, ROLES } from '../constants/actions';

/**
 * Hook utama untuk mengelola sesi Scrum Poker via WebRTC (PeerJS).
 * Sepenuhnya mengisolasi logika jaringan dan sinkronisasi dari komponen UI.
 */
export function usePokerSession({ roomId, userName, role, avatar, isHost, onIdUnavailable }) {
  // State room yang tersinkronisasi
  const [topic, setTopic] = useState('');
  const [participants, setParticipants] = useState([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [myVote, setMyVote] = useState(null);
  const [timerEndTime, setTimerEndTime] = useState(null);

  // Status koneksi
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionError, setConnectionError] = useState(null);
  const [errorType, setErrorType] = useState(null);

  // Referensi internal untuk koneksi
  const peerInstanceRef = useRef(null);
  const activeConnectionsRef = useRef(new Map()); // Khusus Host: Map<peerId, DataConnection>
  const hostConnectionRef = useRef(null); // Khusus Member: DataConnection ke Host

  // Helper untuk broadcast state dari Host ke seluruh peer
  const broadcastStateToAll = useCallback((stateOverride = {}) => {
    if (!isHost) return;

    setParticipants((currentParticipants) => {
      setIsRevealed((currentRevealed) => {
        setTopic((currentTopic) => {
          setTimerEndTime((currentTimerEndTime) => {
            const payload = {
              topic: stateOverride.topic !== undefined ? stateOverride.topic : currentTopic,
              isRevealed: stateOverride.isRevealed !== undefined ? stateOverride.isRevealed : currentRevealed,
              participants: stateOverride.participants !== undefined ? stateOverride.participants : currentParticipants,
              timerEndTime: stateOverride.timerEndTime !== undefined ? stateOverride.timerEndTime : currentTimerEndTime,
            };

            const message = JSON.stringify({
              type: PEER_ACTIONS.SYNC_STATE,
              payload,
            });

            activeConnectionsRef.current.forEach((conn) => {
              if (conn.open) {
                try {
                  conn.send(message);
                } catch (err) {
                  console.error('Gagal mengirim state ke peer:', err);
                }
              }
            });

            return currentTimerEndTime;
          });

          return currentTopic;
        });
        return currentRevealed;
      });
      return currentParticipants;
    });
  }, [isHost]);

  // Efek inisialisasi PeerJS
  useEffect(() => {
    let isCancelled = false;
    setIsConnecting(true);
    setConnectionError(null);

    // Konfigurasi server publik PeerJS gratis
    const peer = isHost
      ? new Peer(roomId, { debug: 1 })
      : new Peer(undefined, { debug: 1 });

    peerInstanceRef.current = peer;

    peer.on('open', (id) => {
      if (isCancelled) return;
      setIsConnecting(false);

      if (isHost) {
        // Daftarkan Host sebagai partisipan pertama
        setParticipants([
          {
            id,
            name: userName,
            role: role || ROLES.HOST,
            avatar: avatar || null,
            vote: null,
            isHost: true,
          },
        ]);
      } else {
        // Member: Sambungkan ke Host
        const conn = peer.connect(roomId, {
          reliable: true,
          metadata: { name: userName, role, avatar },
        });

        hostConnectionRef.current = conn;

        conn.on('open', () => {
          if (isCancelled) return;
          setIsConnecting(false);
          // Kirim pesan JOIN ke Host
          conn.send(
            JSON.stringify({
              type: PEER_ACTIONS.JOIN,
              payload: {
                id,
                name: userName,
                role: role || ROLES.VOTER,
                avatar: avatar || null,
              },
            })
          );
        });

        conn.on('data', (rawData) => {
          if (isCancelled) return;
          try {
            const data = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
            if (data.type === PEER_ACTIONS.SYNC_STATE) {
              const { topic: syncedTopic, isRevealed: syncedRevealed, participants: syncedParticipants, timerEndTime: syncedTimer } = data.payload;
              setTopic(syncedTopic || '');
              setIsRevealed(syncedRevealed || false);
              setParticipants(syncedParticipants || []);
              setTimerEndTime(syncedTimer || null);

              // Perbarui status vote diri sendiri jika ada reset
              if (!syncedRevealed) {
                const self = (syncedParticipants || []).find((p) => p.id === id);
                if (self && self.vote === null) {
                  setMyVote(null);
                }
              }
            }
          } catch (err) {
            console.error('Gagal memproses data dari host:', err);
          }
        });

        conn.on('close', () => {
          if (isCancelled) return;
          setConnectionError('Koneksi dengan Host terputus. Silakan muat ulang halaman.');
        });

        conn.on('error', (err) => {
          if (isCancelled) return;
          console.error('Error koneksi ke host:', err);
          setConnectionError('Gagal terhubung ke Host. Pastikan Room ID valid dan Host masih aktif.');
        });
      }
    });

    // Khusus Host: Tangani koneksi masuk dari peer anggota
    if (isHost) {
      peer.on('connection', (conn) => {
        const peerId = conn.peer;
        activeConnectionsRef.current.set(peerId, conn);

        conn.on('data', (rawData) => {
          if (isCancelled) return;
          try {
            const data = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;

            if (data.type === PEER_ACTIONS.JOIN) {
              const newMember = data.payload;
              setParticipants((previous) => {
                const existingIndex = previous.findIndex((p) => p.id === newMember.id);
                let updatedList;
                if (existingIndex >= 0) {
                  updatedList = [...previous];
                  updatedList[existingIndex] = { ...updatedList[existingIndex], ...newMember };
                } else {
                  updatedList = [...previous, { ...newMember, vote: null, isHost: false }];
                }

                // Kirim state terbaru saat ini ke anggota baru
                setTimeout(() => {
                  broadcastStateToAll({ participants: updatedList });
                }, 50);

                return updatedList;
              });
            } else if (data.type === PEER_ACTIONS.VOTE) {
              const { card } = data.payload;
              setParticipants((previous) => {
                const updatedList = previous.map((p) =>
                  p.id === peerId ? { ...p, vote: card } : p
                );
                broadcastStateToAll({ participants: updatedList });
                return updatedList;
              });
            }
          } catch (err) {
            console.error('Gagal parsing data masuk di Host:', err);
          }
        });

        conn.on('close', () => {
          activeConnectionsRef.current.delete(peerId);
          setParticipants((previous) => {
            const updatedList = previous.filter((p) => p.id !== peerId);
            broadcastStateToAll({ participants: updatedList });
            return updatedList;
          });
        });

        conn.on('error', (err) => {
          console.error(`Error pada koneksi peer ${peerId}:`, err);
          activeConnectionsRef.current.delete(peerId);
        });
      });
    }

    peer.on('error', (err) => {
      if (isCancelled) return;
      console.error('PeerJS Global Error:', err);
      setIsConnecting(false);
      setErrorType(err.type);
      if (err.type === 'unavailable-id') {
        const errorMsg = `Room ID "${roomId}" sudah digunakan oleh Host lain yang sedang aktif. Silakan pilih ID yang berbeda.`;
        setConnectionError(errorMsg);
        if (onIdUnavailable) {
          onIdUnavailable(roomId, errorMsg);
        }
      } else if (err.type === 'peer-unavailable') {
        setConnectionError('Room tidak ditemukan atau Host sedang offline.');
      } else {
        setConnectionError(`Koneksi terganggu: ${err.message || 'Error tidak diketahui'}`);
      }
    });

    // Cleanup wajib untuk mencegah kebocoran memori
    return () => {
      isCancelled = true;
      activeConnectionsRef.current.forEach((conn) => {
        try {
          conn.close();
        } catch (_) {}
      });
      activeConnectionsRef.current.clear();

      if (hostConnectionRef.current) {
        try {
          hostConnectionRef.current.close();
        } catch (_) {}
      }

      try {
        peer.destroy();
      } catch (_) {}
    };
  }, [roomId, userName, role, avatar, isHost, onIdUnavailable, broadcastStateToAll]);

  // Aksi memilih kartu (Voter)
  const submitVote = useCallback((cardValue) => {
    const newVote = myVote === cardValue ? null : cardValue;
    setMyVote(newVote);

    if (isHost) {
      setParticipants((previous) => {
        const updatedList = previous.map((p) =>
          p.isHost ? { ...p, vote: newVote } : p
        );
        broadcastStateToAll({ participants: updatedList });
        return updatedList;
      });
    } else if (hostConnectionRef.current && hostConnectionRef.current.open) {
      hostConnectionRef.current.send(
        JSON.stringify({
          type: PEER_ACTIONS.VOTE,
          payload: { card: newVote },
        })
      );
    }
  }, [myVote, isHost, broadcastStateToAll]);

  // Aksi Host: Mengubah topik tiket
  const updateTopic = useCallback((newTopic) => {
    if (!isHost) return;
    setTopic(newTopic);
    broadcastStateToAll({ topic: newTopic });
  }, [isHost, broadcastStateToAll]);

  // Aksi Host: Buka kartu (Reveal)
  const revealCards = useCallback(() => {
    if (!isHost) return;
    setIsRevealed(true);
    broadcastStateToAll({ isRevealed: true });
  }, [isHost, broadcastStateToAll]);

  // Aksi Host: Memulai hitung mundur timer
  const startTimer = useCallback((seconds) => {
    if (!isHost) return;
    const endTime = Date.now() + seconds * 1000;
    setTimerEndTime(endTime);
    broadcastStateToAll({ timerEndTime: endTime });
  }, [isHost, broadcastStateToAll]);

  // Aksi Host: Menghentikan timer
  const stopTimer = useCallback(() => {
    if (!isHost) return;
    setTimerEndTime(null);
    broadcastStateToAll({ timerEndTime: null });
  }, [isHost, broadcastStateToAll]);

  // Aksi Host: Reset putaran (New Round)
  const resetRound = useCallback(() => {
    if (!isHost) return;
    setIsRevealed(false);
    setMyVote(null);
    setTimerEndTime(null);
    setParticipants((previous) => {
      const resetList = previous.map((p) => ({ ...p, vote: null }));
      broadcastStateToAll({ isRevealed: false, participants: resetList, timerEndTime: null });
      return resetList;
    });
  }, [isHost, broadcastStateToAll]);

  return {
    topic,
    participants,
    isRevealed,
    myVote,
    timerEndTime,
    isConnecting,
    connectionError,
    errorType,
    submitVote,
    updateTopic,
    revealCards,
    resetRound,
    startTimer,
    stopTimer,
  };
}

