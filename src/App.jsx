import React, { useState, useEffect } from 'react';
import { LobbyView } from './components/lobby/LobbyView';
import { Navbar } from './components/layout/Navbar';
import { SessionHeader } from './components/layout/SessionHeader';
import { ParticipantTable } from './components/poker/ParticipantTable';
import { VotingDeck } from './components/poker/VotingDeck';
import { SummaryStats } from './components/poker/SummaryStats';
import { DebateSpotlight } from './components/poker/DebateSpotlight';
import { ConsensusCelebration } from './components/poker/ConsensusCelebration';
import { usePokerSession } from './hooks/usePokerSession';
import { CircleNotch, WarningCircle } from '@phosphor-icons/react';

export default function App() {
  const [sessionConfig, setSessionConfig] = useState(null);
  const [initialRoomId, setInitialRoomId] = useState('');
  const [lobbyError, setLobbyError] = useState('');

  // Periksa apakah pengguna membuka tautan dengan parameter ?room=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam) {
      setInitialRoomId(roomParam);
    }
  }, []);

  const handleEnterRoom = (config) => {
    setLobbyError('');
    setSessionConfig(config);
    // Perbarui URL tanpa reload halaman
    const newUrl = `${window.location.pathname}?room=${config.roomId}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  };

  const handleLeaveRoom = () => {
    setSessionConfig(null);
    setLobbyError('');
    const cleanUrl = window.location.pathname;
    window.history.pushState({ path: cleanUrl }, '', cleanUrl);
  };

  const handleIdUnavailable = (takenRoomId, errorMsg) => {
    // Kembalikan Host ke Lobby secara otomatis jika Room ID sudah dipakai
    setSessionConfig(null);
    setLobbyError(errorMsg);
    const cleanUrl = window.location.pathname;
    window.history.pushState({ path: cleanUrl }, '', cleanUrl);
  };

  if (!sessionConfig) {
    return (
      <LobbyView
        onEnterRoom={handleEnterRoom}
        initialRoomId={initialRoomId}
        initialError={lobbyError}
      />
    );
  }

  return (
    <RoomScreen
      config={sessionConfig}
      onLeaveRoom={handleLeaveRoom}
      onIdUnavailable={handleIdUnavailable}
    />
  );
}

function RoomScreen({ config, onLeaveRoom, onIdUnavailable }) {
  const {
    topic,
    participants,
    isRevealed,
    myVote,
    timerEndTime,
    isConnecting,
    connectionError,
    submitVote,
    updateTopic,
    revealCards,
    resetRound,
    startTimer,
    stopTimer,
  } = usePokerSession({
    ...config,
    onIdUnavailable,
  });

  // Early Return: Kondisi Error Koneksi Umum
  if (connectionError) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full p-6 rounded-xl bg-zinc-900 border border-red-500/30 text-center">
          <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-3">
            <WarningCircle size={28} />
          </div>
          <h2 className="text-lg font-semibold text-zinc-100 mb-1">
            Gangguan Koneksi Room
          </h2>
          <p className="text-sm text-zinc-400 mb-5 leading-relaxed">
            {connectionError}
          </p>
          <button
            type="button"
            onClick={onLeaveRoom}
            className="w-full py-2.5 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium transition-colors active:scale-[0.98]"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  // Early Return: Kondisi Loading / Sedang Terhubung
  if (isConnecting) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center p-4 text-center">
        <CircleNotch size={32} className="text-indigo-500 animate-spin mb-3" />
        <h2 className="text-sm font-medium text-zinc-300">
          Menghubungkan ke Ruangan WebRTC...
        </h2>
        <p className="text-xs text-zinc-500 mt-1 font-mono">
          Room ID: {config.roomId}
        </p>
      </div>
    );
  }

  const hasAnyVotes = participants.some(
    (p) => p.role !== 'SPECTATOR' && p.vote !== null && p.vote !== undefined
  );

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between">
      {/* Navbar Atas */}
      <Navbar
        roomId={config.roomId}
        participantCount={participants.length}
        onLeaveRoom={onLeaveRoom}
      />

      {/* Konten Utama Sesi Poker */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-between gap-6">
        <SessionHeader
          topic={topic}
          onUpdateTopic={updateTopic}
          isHost={config.isHost}
          isRevealed={isRevealed}
          onReveal={revealCards}
          onReset={resetRound}
          hasVotes={hasAnyVotes}
          timerEndTime={timerEndTime}
          onStartTimer={startTimer}
          onStopTimer={stopTimer}
        />

        <ParticipantTable
          participants={participants}
          isRevealed={isRevealed}
          roomId={config.roomId}
        />

        {isRevealed && <SummaryStats participants={participants} />}

        <DebateSpotlight
          participants={participants}
          isRevealed={isRevealed}
        />

        <VotingDeck
          selectedVote={myVote}
          onSelectVote={submitVote}
          disabled={isRevealed}
          isSpectator={config.role === 'SPECTATOR'}
        />
      </main>

      {/* Efek Selebrasi Konsensus */}
      <ConsensusCelebration
        isRevealed={isRevealed}
        participants={participants}
      />
    </div>
  );
}
