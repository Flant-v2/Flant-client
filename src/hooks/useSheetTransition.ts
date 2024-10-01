import { useLayoutEffect, useState } from 'react';

type useSheetTransitionProps = {
  isOpen: boolean;
  ref: React.MutableRefObject<HTMLElement | null>;
};
export const useSheetTransition = ({ isOpen, ref: formRef }: useSheetTransitionProps) => {
  const [sheetMount, setSheetMount] = useState(false);

  useLayoutEffect(() => {
    setTimeout(() => {
      // 스스륵 효과가 발생하기 위해서 언마운트되는 시간을 늦추기 위해 sheetMount 상태를 추가로 관리함.
      // 300초 후에 언마운트됨! isOpen의 값이 false로 변하는 즉시 translate-y-full이 실행된다!
      setSheetMount(isOpen);
    }, 300);

    if (isOpen) {
      // useLayoutEffect를 사용해서 form이 랜더링될 때 아래서 랜더링될 수 있도록 조작
      formRef.current?.classList.add('translate-y-full');
      setTimeout(() => {
        // 즉시 translate-y-0를 통해서 원래 자리로 이동하면서 스르륵 효과를 넣을 수 있도록 처리함.
        formRef.current?.classList.remove('translate-y-full');
        formRef.current?.classList.add('translate-y-0');
      }, 0);
    }
  }, [isOpen]);
  return sheetMount;
};
