// 스크롤을 방지하고 현재 위치를 반환한다.
// 현재 스크롤 위치 리턴함: number 타입
export const preventScroll = () => {
  const currentScrollY = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
  document.body.style.top = `-${currentScrollY}px`; // 현재 스크롤 위치
  document.body.style.overflowY = 'scroll';
  return currentScrollY;
};

// 스크롤을 허용하고, 스크롤 방지 함수에서 반환된 위치로 이동한다.
// params : prevScrollY 스크롤 방지 함수에서 반환된 스크롤 위치 :number
export const allowScroll = (prevScrollY: number) => {
  document.body.style.position = '';
  document.body.style.width = '';
  document.body.style.top = '';
  document.body.style.overflowY = '';
  window.scrollTo(0, prevScrollY);
};
