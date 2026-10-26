import React, { useState, useEffect } from 'react';
import { Cards, Plus, SignIn, User, Eye, Sparkle, ArrowsClockwise, Hash } from '@phosphor-icons/react';
import { ROLES } from '../../constants/actions';
import { TEAM_AVATARS } from '../../constants/avatars';
import { AvatarPicker } from './AvatarPicker';

function generateRandomRoomId() {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `poker-${randomSuffix}`;
}

export function LobbyView({ onEnterRoom, initialRoomId, initialError = '' }) {
  const [activeTab, setActiveTab] = useState(initialRoomId ? 'join' : 'create');
  const [userName, setUserName] = useState(() => localStorage.getItem('poker_username') || '');
  const [selectedAvatar, setSelectedAvatar] = useState(() => localStorage.getItem('poker_avatar') || TEAM_AVATARS[0].src);
  const [customRoomId, setCustomRoomId] = useState('');
  const [joinRoomId, setJoinRoomId] = useState(initialRoomId || '');
  const [selectedRole, setSelectedRole] = useState(ROLES.VOTER);
  const [validationError, setValidationError] = useState(initialError);

  useEffect(() => {
    if (initialError) {
      setValidationError(initialError);
      setActiveTab('create');
    }
  }, [initialError]);

  useEffect(() => {
    if (initialRoomId) {
      setJoinRoomId(initialRoomId);
      setActiveTab('join');
    }
  }, [initialRoomId]);

  const handleRandomizeId = () => {
    const randomId = generateRandomRoomId();
    setCustomRoomId(randomId);
    if (validationError) setValidationError('');
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const cleanName = userName.trim();
    if (!cleanName) {
      setValidationError('Silakan masukkan nama Anda.');
      return;
    }

    let finalRoomId = customRoomId.trim().toLowerCase();

    // Jika custom ID diisi, validasi formatnya
    if (finalRoomId) {
      const isValidFormat = /^[a-z0-9-]+$/.test(finalRoomId);
      if (!isValidFormat) {
        setValidationError('ID Room hanya boleh berupa huruf kecil, angka, dan tanda strip (-). Tanpa spasi atau simbol.');
        return;
      }
      if (finalRoomId.length < 3 || finalRoomId.length > 30) {
        setValidationError('Panjang ID Room harus antara 3 hingga 30 karakter.');
        return;
      }
    } else {
      finalRoomId = generateRandomRoomId();
    }

    localStorage.setItem('poker_username', cleanName);
    localStorage.setItem('poker_avatar', selectedAvatar);
    onEnterRoom({
      roomId: finalRoomId,
      userName: cleanName,
      role: selectedRole,
      avatar: selectedAvatar,
      isHost: true,
    });
  };

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    const cleanName = userName.trim();
    const cleanRoom = joinRoomId.trim().toLowerCase();

    if (!cleanName) {
      setValidationError('Silakan masukkan nama Anda.');
      return;
    }
    if (!cleanRoom) {
      setValidationError('Silakan masukkan Kode Room.');
      return;
    }

    localStorage.setItem('poker_username', cleanName);
    localStorage.setItem('poker_avatar', selectedAvatar);
    onEnterRoom({
      roomId: cleanRoom,
      userName: cleanName,
      role: selectedRole,
      avatar: selectedAvatar,
      isHost: false,
    });
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-4 py-12">
      {/* Brand Header */}
      <div className="text-center mb-8 max-w-md">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 mb-4">
          <Cards size={28} weight="regular" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
          Scrum Poker Realtime
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Estimasi story point tim secara instan langsung di browser via WebRTC tanpa perlu registrasi akun.
        </p>
      </div>

      {/* Main Container Card */}
      <div className="w-full max-w-md bg-zinc-900/90 border border-zinc-800 rounded-xl p-6 shadow-xl backdrop-blur-sm">
        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800/80 mb-6">
          <button
            type="button"
            onClick={() => {
              setActiveTab('create');
              setValidationError('');
            }}
            className={`flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-md transition-all ${
              activeTab === 'create'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Plus size={14} />
            <span>Buat Room Baru</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('join');
              setValidationError('');
            }}
            className={`flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-md transition-all ${
              activeTab === 'join'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <SignIn size={14} />
            <span>Gabung Room</span>
          </button>
        </div>

        {/* Error Guard */}
        {validationError && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-800/50 text-red-300 text-xs leading-relaxed">
            {validationError}
          </div>
        )}

        {/* Forms */}
        {activeTab === 'create' ? (
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            {/* Nama Host */}
            <div>
              <label htmlFor="create-name" className="block text-xs font-medium text-zinc-300 mb-1.5">
                Nama Anda
              </label>
              <div className="relative">
                <input
                  id="create-name"
                  type="text"
                  placeholder="Contoh: Alex (Scrum Master)"
                  value={userName}
                  onChange={(e) => {
                    setUserName(e.target.value);
                    if (validationError) setValidationError('');
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  maxLength={30}
                  autoFocus
                />
                <User size={16} className="absolute right-3.5 top-3 text-zinc-500" />
              </div>
            </div>

            {/* Custom Room ID */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="custom-room" className="block text-xs font-medium text-zinc-300">
                  ID Room Kustom <span className="text-zinc-500 font-normal">(Opsional)</span>
                </label>
                <button
                  type="button"
                  onClick={handleRandomizeId}
                  className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <ArrowsClockwise size={12} />
                  <span>Acak ID</span>
                </button>
              </div>
              <div className="relative">
                <input
                  id="custom-room"
                  type="text"
                  placeholder="Contoh: sprint-be-12 (atau acak otomatis)"
                  value={customRoomId}
                  onChange={(e) => {
                    setCustomRoomId(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                    if (validationError) setValidationError('');
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors font-mono"
                  maxLength={30}
                />
                <Hash size={16} className="absolute right-3.5 top-3 text-zinc-500" />
              </div>
              <p className="mt-1 text-[11px] text-zinc-500">
                Gunakan ID yang unik untuk tim Anda. Jika ID sudah dipakai, sistem akan menolak.
              </p>
            </div>

            {/* Pilih Karakter Wajah */}
            <AvatarPicker
              selectedAvatar={selectedAvatar}
              onSelectAvatar={setSelectedAvatar}
            />

            {/* Role Options */}
            <div>
              <span className="block text-xs font-medium text-zinc-300 mb-1.5">
                Peran Anda di Sesi Ini
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRole(ROLES.VOTER)}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-all ${
                    selectedRole === ROLES.VOTER
                      ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <Sparkle size={15} />
                  <span>Ikut Voting</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole(ROLES.SPECTATOR)}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-all ${
                    selectedRole === ROLES.SPECTATOR
                      ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <Eye size={15} />
                  <span>Hanya Memantau</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors shadow-sm active:scale-[0.98]"
            >
              Mulai Sesi sebagai Host
            </button>
          </form>
        ) : (
          <form onSubmit={handleJoinSubmit} className="space-y-4">
            <div>
              <label htmlFor="join-room" className="block text-xs font-medium text-zinc-300 mb-1.5">
                Kode / ID Room
              </label>
              <input
                id="join-room"
                type="text"
                placeholder="Contoh: sprint-be-12"
                value={joinRoomId}
                onChange={(e) => {
                  setJoinRoomId(e.target.value);
                  if (validationError) setValidationError('');
                }}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors font-mono"
              />
            </div>

            <div>
              <label htmlFor="join-name" className="block text-xs font-medium text-zinc-300 mb-1.5">
                Nama Anda
              </label>
              <div className="relative">
                <input
                  id="join-name"
                  type="text"
                  placeholder="Contoh: Budi (Frontend)"
                  value={userName}
                  onChange={(e) => {
                    setUserName(e.target.value);
                    if (validationError) setValidationError('');
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  maxLength={30}
                />
                <User size={16} className="absolute right-3.5 top-3 text-zinc-500" />
              </div>
            </div>

            {/* Pilih Karakter Wajah */}
            <AvatarPicker
              selectedAvatar={selectedAvatar}
              onSelectAvatar={setSelectedAvatar}
            />

            {/* Role Options */}
            <div>
              <span className="block text-xs font-medium text-zinc-300 mb-1.5">
                Peran Anda
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRole(ROLES.VOTER)}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-all ${
                    selectedRole === ROLES.VOTER
                      ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <Sparkle size={15} />
                  <span>Voter</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole(ROLES.SPECTATOR)}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-all ${
                    selectedRole === ROLES.SPECTATOR
                      ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <Eye size={15} />
                  <span>Spectator</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors shadow-sm active:scale-[0.98]"
            >
              Masuk ke Ruangan
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
