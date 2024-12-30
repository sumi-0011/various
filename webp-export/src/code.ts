/// <reference types="@figma/plugin-typings" />

figma.showUI(__html__, { width: 320, height: 600 });

// 선택된 노드의 PNG 데이터를 UI로 전송
const sendPngData = async () => {
  const node = figma.currentPage.selection[0];
  if (node) {
    const bytes = await node.exportAsync({ format: 'PNG' });
    figma.ui.postMessage({
      type: 'init-png-data',
      bytes: bytes,
    });
  }
};

figma.on('selectionchange', sendPngData);

// 초기 데이터 전송
sendPngData();

figma.ui.onmessage = (msg) => {
  if (msg.type === 'export-complete') {
    figma.notify('WebP 내보내기가 완료되었습니다.');
  } else if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};
