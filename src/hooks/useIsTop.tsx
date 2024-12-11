'use client';

import React, { useEffect, useState } from 'react';

/**
 * 페이지의 스크롤 위치가 지정된 임계값 이하인지 확인하는 커스텀 훅
 *
 * @param {number} topThreshold - 'top' 상태로 간주할 스크롤 위치의 최대값 (기본값: 0)
 * @param {boolean} enabled - 스크롤 이벤트 감지 활성화 여부 (기본값: true)
 * @returns {{ isTop: boolean }} 현재 스크롤 위치가 임계값 이하인지 여부
 *
 * @example
 * const { isTop } = useIsTop(50, true);
 * console.log(isTop); // 스크롤 위치가 50px 이하일 때 true, 그 외에는 false
 */
const useIsTop = (topThreshold: number = 0, enabled: boolean = true) => {
  const [isTop, setIsTop] = useState<boolean>(true);

  useEffect(() => {
    function scroll() {
      if (window.scrollY <= topThreshold) setIsTop(true);
      else setIsTop(false);
    }

    if (enabled) {
      scroll(); // 초기 상태 설정
      window.addEventListener('scroll', scroll);
    } else {
      setIsTop(true); // enabled가 false일 때는 항상 true로 설정
    }

    return () => {
      if (enabled) {
        window.removeEventListener('scroll', scroll);
      }
    };
  }, [topThreshold, enabled]);

  return { isTop };
};

export default useIsTop;
