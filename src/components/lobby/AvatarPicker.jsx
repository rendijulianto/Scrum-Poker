import React, { useState, useRef } from 'react';
import { PRESET_AVATARS } from '../../constants/avatars';
import { compressImageToBase64 } from '../../utils/image';
import { Check, Smiley, Camera, UploadSimple, Image as ImageIcon } from '@phosphor-icons/react';

export function AvatarPicker({ selectedAvatar, onSelectAvatar }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  // Cek apakah avatar saat ini merupakan custom upload (data:image/jpeg;base64,...)
  const isCustomUploaded =
    selectedAvatar &&
    selectedAvatar.startsWith('data:image/') &&
    !PRESET_AVATARS.some((p) => p.src === selectedAvatar);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setUploadError('');

    try {
      // Kompres dan ubah foto ke Base64 (~10KB - 160x160px)
      const base64Data = await compressImageToBase64(file, 160, 0.85);
      onSelectAvatar(base64Data);
    } catch (err) {
      setUploadError(err.message || 'Gagal mengunggah foto. Silakan coba berkas lain.');
    } finally {
      setIsProcessing(false);
      // Reset input agar bisa memilih file yang sama jika diinginkan
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleTriggerUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const currentTitle = isCustomUploaded
    ? 'Foto Pribadi (Base64)'
    : PRESET_AVATARS.find((a) => a.src === selectedAvatar)?.title || 'Pilih Karakter';

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-300">
          <Smiley size={15} className="text-indigo-400" />
          <span>Karakter / Foto Avatar</span>
        </label>
        <span className="text-[11px] text-zinc-400 font-mono">
          {currentTitle}
        </span>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Error Banner */}
      {uploadError && (
        <div className="mb-2 p-2 rounded-lg bg-red-950/50 border border-red-800 text-red-300 text-[11px]">
          {uploadError}
        </div>
      )}

      {/* Avatars & Upload Selector Bar */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 px-1 scrollbar-none">
        {/* Upload Custom Photo Button / Preview Card */}
        <button
          type="button"
          onClick={handleTriggerUpload}
          disabled={isProcessing}
          className={`relative shrink-0 w-12 h-12 rounded-full border-2 transition-all duration-150 flex flex-col items-center justify-center cursor-pointer active:scale-[0.95] overflow-hidden ${
            isCustomUploaded
              ? 'ring-2 ring-offset-2 ring-offset-zinc-950 ring-indigo-500 border-indigo-400 scale-105'
              : 'border-dashed border-zinc-700 bg-zinc-950/80 hover:border-indigo-400 hover:bg-zinc-900 text-zinc-400 hover:text-indigo-300'
          }`}
          title="Unggah foto profil Anda sendiri (Base64)"
        >
          {isCustomUploaded ? (
            <>
              <img
                src={selectedAvatar}
                alt="Foto Profil Pribadi"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 hover:bg-black/50 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity">
                <Camera size={14} />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-indigo-600 border border-zinc-950 flex items-center justify-center text-white">
                <Check size={10} weight="bold" />
              </div>
            </>
          ) : isProcessing ? (
            <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <div className="flex flex-col items-center">
              <UploadSimple size={15} />
              <span className="text-[8px] font-mono uppercase tracking-tighter mt-0.5">Upload</span>
            </div>
          )}
        </button>

        {/* Separator Line */}
        <div className="w-px h-8 bg-zinc-800 shrink-0 mx-0.5" />

        {/* Preset Character Avatars */}
        {PRESET_AVATARS.map((avatar) => {
          const isSelected = selectedAvatar === avatar.src;

          return (
            <button
              key={avatar.id}
              type="button"
              onClick={() => onSelectAvatar(avatar.src)}
              title={avatar.title}
              className={`relative shrink-0 w-12 h-12 rounded-full transition-all duration-150 cursor-pointer active:scale-[0.95] overflow-hidden ${
                isSelected
                  ? 'ring-2 ring-offset-2 ring-offset-zinc-950 ring-indigo-500 scale-105'
                  : 'opacity-70 hover:opacity-100 hover:scale-102 border border-zinc-700/60'
              }`}
            >
              <img
                src={avatar.src}
                alt={avatar.title}
                className="w-full h-full rounded-full object-cover select-none"
                loading="lazy"
              />
              {isSelected && (
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-indigo-600 border border-zinc-950 flex items-center justify-center text-white">
                  <Check size={10} weight="bold" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <p className="text-[10px] text-zinc-500 mt-1">
        Klik tombol <span className="font-medium text-zinc-400">Upload</span> untuk memilih foto sendiri (otomatis dikonversi ke Base64 ringan), atau pilih karakter siap pakai.
      </p>
    </div>
  );
}
