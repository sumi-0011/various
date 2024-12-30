// 미리보기용 변환 함수
export async function previewWebP(
  pngBytes: Uint8Array,
  quality: number,
  scale: number
): Promise<{ originalSize: number; convertedSize: number }> {
  const originalSize = pngBytes.length;

  const blob = new Blob([pngBytes], { type: 'image/png' });
  const image = new Image();
  image.src = URL.createObjectURL(blob);

  await new Promise((resolve) => {
    image.onload = resolve;
  });

  const canvas = document.createElement('canvas');
  canvas.width = image.width * scale;
  canvas.height = image.height * scale;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (webpBlob) => {
        if (webpBlob) {
          resolve({
            originalSize: originalSize * scale ** 2, // 스케일에 따른 원본 크기 조정
            convertedSize: webpBlob.size,
          });
        } else {
          reject(new Error('WebP 변환 실패'));
        }
      },
      'image/webp',
      quality / 100
    );
  });
}

// 실제 내보내기용 함수
export const exportWebP = async (
  pngBytes: Uint8Array,
  fileName: string,
  quality: number,
  scale: number
): Promise<Blob> => {
  const blob = new Blob([pngBytes], { type: 'image/png' });
  const image = new Image();
  image.src = URL.createObjectURL(blob);

  await new Promise((resolve) => {
    image.onload = resolve;
  });

  const canvas = document.createElement('canvas');
  canvas.width = image.width * scale;
  canvas.height = image.height * scale;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (webpBlob) => {
        if (webpBlob) {
          resolve(webpBlob);
        } else {
          reject(new Error('WebP 변환 실패'));
        }
      },
      'image/webp',
      quality / 100
    );
  });
};
