import { useEffect, useRef } from 'react';
import { allowScroll, preventScroll } from '@/utils/scroll';

// 바디 스크롤을 막는 커스텀 훅
export const useBodyScrollLock = (isOpen: boolean) => {
  // 스크롤 위치 넘버값을 받는 ref
  const scrollPositionRef = useRef<number | null>(null);

  // 현재 열리고 닫히는 상태 인지하여 바디부분 스크롤을 방지해주는 Effect
  useEffect(() => {
    if (isOpen) {
      // 열렸을때 바디 잠금.
      scrollPositionRef.current = preventScroll();
      return;
    }
    // 풀리면 바디 풀고 해당 스크롤 값으로 이동.
    scrollPositionRef.current && allowScroll(scrollPositionRef.current);
  }, [isOpen]);
};
