/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-restricted-globals */
import * as React from 'react';

import * as ReactDOM from 'react-dom/client';
import './ui.css';

declare function require(path: string): any;

function App() {
  const [scale, setScale] = React.useState(2);
  const [fileName, setFileName] = React.useState('');

  const onExport = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'export-webp',
          scale: scale,
          fileName: fileName.trim(),
        },
      },
      '*'
    );
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

window.onmessage = async (event) => {
  const msg = event.data.pluginMessage;

  if (msg.type === 'export-complete') {
    try {
      // PNG 바이트 데이터를 Blob으로 변환
      const blob = new Blob([msg.bytes], { type: 'image/png' });

      // Blob을 이미지로 변환
      const image = new Image();
      image.src = URL.createObjectURL(blob);

      await new Promise((resolve) => {
        image.onload = resolve;
      });

      // Canvas 생성 및 이미지 그리기
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0);

      // Canvas를 WEBP로 변환하여 다운로드
      canvas.toBlob((webpBlob) => {
        const url = URL.createObjectURL(webpBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = msg.fileName;
        a.click();
        URL.revokeObjectURL(url);
      }, 'image/webp');
    } catch (error) {
      console.error('WEBP 변환 중 오류 발생:', error);
    }
  }
};

ReactDOM.createRoot(document.getElementById('react-page')).render(<App />);
