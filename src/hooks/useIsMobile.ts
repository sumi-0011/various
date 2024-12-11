'use client';

import { useEffect, useState } from 'react';

const useIsMobile = () => {
  // const _isMobile = useMediaQuery(theme.mobile);
  // const [state, setState] = useState(false);
  // useEffect(() => setState(_isMobile), [_isMobile]);
  // return state;

  // 임시 코드
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // 초기 상태 설정
    checkMobile();

    // resize 이벤트 리스너 등록
    window.addEventListener('resize', checkMobile);

    // cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

export default useIsMobile;
