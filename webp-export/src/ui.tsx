/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-restricted-globals */
import * as React from 'react';

import { previewWebP, exportWebP } from './utils/webpConverter';
import * as ReactDOM from 'react-dom/client';
import './ui.css';

declare function require(path: string): any;

function App() {
  const [scale, setScale] = React.useState(2);
  const [fileName, setFileName] = React.useState('');
  const [quality, setQuality] = React.useState(80);
  const [originalSize, setOriginalSize] = React.useState(0);
  const [convertedSize, setConvertedSize] = React.useState(0);
  const [pngBytes, setPngBytes] = React.useState<Uint8Array | null>(null);

  // PNG 데이터를 받아오는 부분
  React.useEffect(() => {
    const messageHandler = (event: MessageEvent) => {
      const msg = event.data.pluginMessage;
      if (msg.type === 'init-png-data') {
        setPngBytes(msg.bytes);
      }
    };

    window.addEventListener('message', messageHandler);
    return () => window.removeEventListener('message', messageHandler);
  }, []);

  // 품질이나 스케일이 변경될 때마다 미리보기 업데이트
  React.useEffect(() => {
    if (!pngBytes) return;

    const updatePreview = async () => {
      try {
        const { originalSize, convertedSize } = await previewWebP(pngBytes, quality, scale);
        setOriginalSize(originalSize);
        setConvertedSize(convertedSize);
      } catch (error) {
        console.error('미리보기 생성 중 오류:', error);
      }
    };

    updatePreview();
  }, [pngBytes, quality, scale]);

  const onExport = async () => {
    if (!pngBytes) return;

    try {
      await exportWebP(pngBytes, fileName.trim(), quality, scale);
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
        <h2>WEBP 변환기</h2>
      </header>
      <section>
        <p>선택한 이미지를 WEBP 형식으로 변환합니다.</p>

        <div className="input-group">
          <label>배수 설정</label>
          <select value={scale} onChange={(e) => setScale(Number(e.target.value))}>
            <option value={1}>1x</option>
            <option value={2}>2x</option>
            <option value={3}>3x</option>
            <option value={4}>4x</option>
          </select>
        </div>

        <div className="input-group">
          <label>파일 이름 prefix</label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="파일 이름을 입력하세요"
          />
        </div>

        <div className="input-group">
          <label>변환 품질 ({quality}%)</label>
          <input type="range" min="0" max="100" value={quality} onChange={(e) => setQuality(Number(e.target.value))} />
        </div>

        {originalSize > 0 && (
          <div className="size-info">
            <p>원본 크기: {(originalSize / 1024).toFixed(1)}KB</p>
            {convertedSize > 0 && (
              <>
                <p>변환 크기: {(convertedSize / 1024).toFixed(1)}KB</p>
                <p>압축률: {((1 - convertedSize / originalSize) * 100).toFixed(1)}%</p>
              </>
            )}
          </div>
        )}
      </section>
      <footer>
        <button className="brand" onClick={onExport}>
          변환하기
        </button>
        <button onClick={onCancel}>취소</button>
      </footer>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('react-page')).render(<App />);
