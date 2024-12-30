/// <reference types="@figma/plugin-typings" />

figma.showUI(__html__, { themeColors: true, height: 300 });

figma.ui.onmessage = async (msg) => {
  console.log('msg: ', msg);
  if (msg.type === 'export-webp') {
    console.log("msg.type === 'export-webp': ", msg.type === 'export-webp');
    console.log('figma.currentPage: ', figma.currentPage);
    const selection = figma.currentPage.selection;
    console.log('selection: ', selection);

    if (selection.length === 0) {
      figma.notify('요소를 선택해주세요!');
      return;
    }

    try {
      for (const node of selection) {
        const settings: ExportSettingsImage = {
          format: 'PNG',
          constraint: {
            type: 'SCALE',
            value: 1,
          },
        };

        const bytes = await node.exportAsync(settings);

        // UI로 바이트 데이터 전송
        figma.ui.postMessage({
          type: 'export-complete',
          fileName: `${node.name}.webp`,
          bytes: bytes,
        });
      }

      figma.notify('내보내기가 완료되었습니다!');
    } catch (error) {
      figma.notify('내보내기 중 오류가 발생했습니다.');
    }
  }
};
