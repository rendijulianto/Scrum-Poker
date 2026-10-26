import { useState, useEffect, useRef, useCallback } from 'react';
import Peer from 'peerjs';
import { PEER_ACTIONS, ROLES } from '../constants/actions';
import { calculateAverage, checkConsensus } from '../utils/math';

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
  const [reactions, setReactions] = useState([]);
  const [history, setHistory] = useState([]);

  // Helper untuk menambah dan membersihkan floating reaction
  const triggerReaction = useCallback((reactionItem) => {
    setReactions((previous) => [...previous, reactionItem]);
    setTimeout(() => {
      setReactions((previous) => previous.filter((r) => r.id !== reactionItem.id));
    }, 2500);
  }, []);

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
            setHistory((currentHistory) => {
              const payload = {
                topic: stateOverride.topic !== undefined ? stateOverride.topic : currentTopic,
                isRevealed: stateOverride.isRevealed !== undefined ? stateOverride.isRevealed : currentRevealed,
                participants: stateOverride.participants !== undefined ? stateOverride.participants : currentParticipants,
                timerEndTime: stateOverride.timerEndTime !== undefined ? stateOverride.timerEndTime : currentTimerEndTime,
                history: stateOverride.history !== undefined ? stateOverride.history : currentHistory,
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

              return currentHistory;
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
              const { topic: syncedTopic, isRevealed: syncedRevealed, participants: syncedParticipants, timerEndTime: syncedTimer, history: syncedHistory } = data.payload;
              setTopic(syncedTopic || '');
              setIsRevealed(syncedRevealed || false);
              setParticipants(syncedParticipants || []);
              setTimerEndTime(syncedTimer || null);
              if (syncedHistory) {
                setHistory(syncedHistory);
              }

              // Perbarui status vote diri sendiri jika ada reset
              if (!syncedRevealed) {
                const self = (syncedParticipants || []).find((p) => p.id === id);
                if (self && self.vote === null) {
                  setMyVote(null);
                }
              }
            } else if (data.type === PEER_ACTIONS.SEND_REACTION) {
              triggerReaction(data.payload);
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
            } else if (data.type === PEER_ACTIONS.SEND_REACTION) {
              const reactionItem = data.payload;
              triggerReaction(reactionItem);
              // Broadcast ke semua peer lain
              const msg = JSON.stringify({
                type: PEER_ACTIONS.SEND_REACTION,
                payload: reactionItem,
              });
              activeConnectionsRef.current.forEach((conn) => {
                if (conn.open && conn.peer !== peerId) {
                  try {
                    conn.send(msg);
                  } catch (_) {}
                }
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

  // Aksi Mengirim Live Emoji Reaction (Semua Anggota)
  const sendReaction = useCallback((emoji) => {
    const reactionItem = {
      id: `${Date.now()}-${Math.random()}`,
      emoji,
      senderName: userName,
      xOffset: Math.floor(15 + Math.random() * 70), // offset 15% - 85%
    };

    triggerReaction(reactionItem);

    if (isHost) {
      const msg = JSON.stringify({
        type: PEER_ACTIONS.SEND_REACTION,
        payload: reactionItem,
      });
      activeConnectionsRef.current.forEach((conn) => {
        if (conn.open) {
          try { conn.send(msg); } catch (_) {}
        }
      });
    } else if (hostConnectionRef.current && hostConnectionRef.current.open) {
      hostConnectionRef.current.send(
        JSON.stringify({
          type: PEER_ACTIONS.SEND_REACTION,
          payload: reactionItem,
        })
      );
    }
  }, [userName, isHost, triggerReaction]);

  // Aksi Host: Reset putaran (New Round) dan simpan ke riwayat
  const resetRound = useCallback(() => {
    if (!isHost) return;
    setIsRevealed(false);
    setMyVote(null);
    setTimerEndTime(null);

    // Arsipkan hasil putaran ke riwayat jika ada voting
    const hasVotedMembers = participants.some((p) => p.role !== 'SPECTATOR' && p.vote);
    let updatedHistory = history;

    if (hasVotedMembers) {
      const avg = calculateAverage(participants);
      const isCons = checkConsensus(participants);
      const historyItem = {
        id: `${Date.now()}-${Math.random()}`,
        topic: topic.trim() || 'Tiket Tanpa Judul',
        average: avg,
        isConsensus: isCons,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        voterCount: participants.filter((p) => p.role !== 'SPECTATOR' && p.vote).length,
      };
      updatedHistory = [historyItem, ...history];
      setHistory(updatedHistory);
    }

    setParticipants((previous) => {
      const resetList = previous.map((p) => ({ ...p, vote: null }));
      broadcastStateToAll({
        isRevealed: false,
        participants: resetList,
        timerEndTime: null,
        history: updatedHistory,
      });
      return resetList;
    });
  }, [isHost, topic, participants, history, broadcastStateToAll]);

  // Aksi Host: Membersihkan riwayat estimasi
  const clearHistory = useCallback(() => {
    if (!isHost) return;
    setHistory([]);
    broadcastStateToAll({ history: [] });
  }, [isHost, broadcastStateToAll]);

  return {
    topic,
    participants,
    isRevealed,
    myVote,
    timerEndTime,
    reactions,
    history,
    isConnecting,
    connectionError,
    errorType,
    submitVote,
    updateTopic,
    revealCards,
    resetRound,
    startTimer,
    stopTimer,
    sendReaction,
    clearHistory,
  };
}

