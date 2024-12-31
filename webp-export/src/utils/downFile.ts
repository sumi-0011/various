import JSZip from 'jszip';

export const downloadZip = async ({
  files,
  fileName,
}: {
  files: { blob: Blob; fileName: string }[];
  fileName: string;
}) => {
  const zip = new JSZip();

  // ZIP 파일에 각 파일 추가
  files.forEach(({ blob, fileName }) => {
    zip.file(fileName, blob);
  });

  // ZIP 생성 및 다운로드
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  await downloadFile(zipBlob, `${fileName}.zip`);
};

export const downloadFile = (blob: Blob, fileName: string) => {
  return new Promise<void>((resolve) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();

    setTimeout(() => {
      URL.revokeObjectURL(url);
      resolve();
    }, 1000);
  });
};
