/**
 * Utilitas untuk mengolah dan mengompresi gambar pengguna menjadi format Base64.
 * Menghasilkan ukuran optimal (~10KB) yang aman ditransmisikan via WebRTC Data Channels.
 */

export function compressImageToBase64(file, targetSize = 160, quality = 0.85) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Berkas harus berupa gambar yang valid (JPG, PNG, WebP).'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = targetSize;
        canvas.height = targetSize;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Gagal mendapatkan konteks canvas.'));
          return;
        }

        // Center-crop agar gambar selalu persegi sempurna untuk avatar bulat
        const minDimension = Math.min(img.width, img.height);
        const sourceX = (img.width - minDimension) / 2;
        const sourceY = (img.height - minDimension) / 2;

        // Gambar ke canvas dengan ukuran target
        ctx.drawImage(
          img,
          sourceX,
          sourceY,
          minDimension,
          minDimension,
          0,
          0,
          targetSize,
          targetSize
        );

        // Konversi ke Base64 JPEG dengan kompresi optimal
        const base64Result = canvas.toDataURL('image/jpeg', quality);
        resolve(base64Result);
      };

      img.onerror = () => {
        reject(new Error('Gagal memproses gambar. Pastikan format berkas tidak rusak.'));
      };

      img.src = event.target.result;
    };

    reader.onerror = () => {
      reject(new Error('Gagal membaca berkas dari perangkat Anda.'));
    };

    reader.readAsDataURL(file);
  });
}
