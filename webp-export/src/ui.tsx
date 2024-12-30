import * as React from 'react';

import { previewWebP, exportWebP } from './utils/webpConverter';
import * as ReactDOM from 'react-dom/client';
import './ui.css';

function App() {
  const { originalSize, convertedSize, updatePreview } = usePreview();
  const { pngBytes, frameName, previewUrl, setInitPngData } = useInitPngData();

  const [scale, setScale] = React.useState(2);
  const [prefix, setPrefix] = React.useState('');
  const [quality, setQuality] = React.useState(80);
  const [fileName, setFileName] = React.useState('');

  React.useEffect(() => {
    setFileName(frameName);
  }, [frameName]);

  React.useEffect(() => {
    const messageHandler = (event: MessageEvent) => {
      const msg = event.data.pluginMessage;
      if (msg.type === 'init-png-data') {
        setInitPngData(msg);
      }
    };

    window.addEventListener('message', messageHandler);
    return () => {
      window.removeEventListener('message', messageHandler);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, []);

  // 품질이나 스케일이 변경될 때마다 미리보기 업데이트
  React.useEffect(() => {
    if (!pngBytes) return;

    updatePreview({ pngBytes, quality, scale });
  }, [pngBytes, quality, scale]);

  const onExport = async () => {
    if (!pngBytes) return;

    try {
      const finalFileName = prefix ? `${prefix}-${fileName}` : fileName;
      await exportWebP(pngBytes, finalFileName.trim(), quality, scale);
      parent.postMessage({ pluginMessage: { type: 'export-complete' } }, '*');
    } catch (error) {
      console.error('내보내기 중 오류:', error);
    }
  };

  const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
  };

  return (
    <main>
      <header>
        <h2>Select Frame To Webp</h2>
      </header>
      <section>
        <div className="preview-container">
          {previewUrl ? (
            <img src={previewUrl} alt="선택된 프레임 미리보기" className="preview-image" />
          ) : (
            <div className="preview-placeholder">
              <span>Please select a frame</span>
            </div>
          )}
        </div>

        <p>Convert selected image to WEBP format.</p>

        <div className="input-group">
          <label>Scale</label>
          <select value={scale} onChange={(e) => setScale(Number(e.target.value))}>
            <option value={1}>1x</option>
            <option value={2}>2x</option>
            <option value={3}>3x</option>
            <option value={4}>4x</option>
          </select>
        </div>

        <div className="input-group">
          <label>File Name</label>
          <div className="file-name-input">
            <input type="text" value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="Input Prefix" />
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Input File Name"
            />
          </div>
        </div>

        <div className="input-group">
          <label>Quality ({quality}%)</label>
          <input type="range" min="0" max="100" value={quality} onChange={(e) => setQuality(Number(e.target.value))} />
        </div>

        {originalSize > 0 && (
          <div className="size-info">
            <p>원본 크기: {(originalSize / 1024).toFixed(1)}KB</p>
            {convertedSize > 0 && (
              <>
                <p>Converted Size: {(convertedSize / 1024).toFixed(1)}KB</p>
                <p>Compression Rate: {((1 - convertedSize / originalSize) * 100).toFixed(1)}%</p>
              </>
            )}
          </div>
        )}
      </section>
      <footer>
        <button className="brand" onClick={onExport}>
          Convert
        </button>
        <button onClick={onCancel}>Cancel</button>
      </footer>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('react-page')).render(<App />);

const usePreview = () => {
  const [originalSize, setOriginalSize] = React.useState(0);
  const [convertedSize, setConvertedSize] = React.useState(0);

  const updatePreview = async ({
    pngBytes,
    quality,
    scale,
  }: {
    pngBytes: Uint8Array;
    quality: number;
    scale: number;
  }) => {
    const { originalSize, convertedSize } = await previewWebP(pngBytes, quality, scale);
    setOriginalSize(originalSize);
    setConvertedSize(convertedSize);
  };

  return { originalSize, convertedSize, updatePreview };
};

const useInitPngData = () => {
  const [pngBytes, setPngBytes] = React.useState<Uint8Array | null>(null);
  const [frameName, setFrameName] = React.useState('');
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  const setInitPngData = ({ bytes, frameName }: { bytes: Uint8Array; frameName: string }) => {
    setPngBytes(bytes);
    // frame 이름 설정
    setFrameName(frameName || '');

    // PNG 데이터로부터 미리보기 URL 생성
    const blob = new Blob([bytes], { type: 'image/png' });
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);
  };

  return { pngBytes, frameName, previewUrl, setInitPngData };
};
