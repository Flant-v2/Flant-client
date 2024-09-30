'use client';

import React, { PropsWithChildren, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Provider, useAtom } from 'jotai';
import { XIcon } from '@/icons';
import { isOpenAtom, sheetStore } from '@/store/sheetStore';
import { cn } from '@/utils/styles';

const Sheet = ({ children }: PropsWithChildren) => {
  // 상태들 => 열리고 닫히고 상태 조타이로 관리!
  const [isOpen] = useAtom(isOpenAtom, { store: sheetStore });
  const scrollPositionRef = useRef<null | number>(null);
  // 현재 열리고 닫히는 상태 인지하여 바디부분 스크롤을 방지해주는 Effect
  useEffect(() => {
    if (isOpen) {
      scrollPositionRef.current = preventScroll();
    } else {
      scrollPositionRef.current && allowScroll(scrollPositionRef.current);
    }
  }, [isOpen]);
  return <Provider store={sheetStore}>{children}</Provider>;
};
export const MemoizedSheet = React.memo(Sheet);

// 바텀시트 컨텐츠 : 자식과 버튼으로 제출시 처리될 onSubmit 함수를 받는다.
type SheetContentProps = {
  onSubmit?: () => void;
};
export const SheetContent = ({ children, onSubmit }: PropsWithChildren<SheetContentProps>) => {
  const [isOpen, setIsOepn] = useAtom(isOpenAtom, { store: sheetStore });
  const [sheetMount, setSheetMount] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setTimeout(() => {
      setSheetMount(isOpen);
    }, 300);
  }, [isOpen]);
  useLayoutEffect(() => {
    if (isOpen) {
      formRef.current?.classList.add('translate-y-full');
      setTimeout(() => {
        formRef.current?.classList.remove('translate-y-full');
        formRef.current?.classList.add('translate-y-0');
      }, 2);
    }
  }, [isOpen]);
  return (
    <div className={isOpen ? '' : sheetMount ? '' : 'hidden'}>
      {/* 뒷배경임 */}
      <div
        className="fixed bottom-0 left-0 right-0 top-0 z-40 bg-black/20"
        onClick={() => {
          setIsOepn(false);
        }}
      />
      <form
        ref={formRef}
        className={`${!isOpen && 'translate-y-full'} fixed bottom-0 left-0 right-0 z-50 max-h-[calc(100vh-60px)] overflow-y-scroll bg-white px-4 transition-transform duration-300 ease-in-out`}
        onSubmit={e => {
          e.preventDefault();
          onSubmit && onSubmit();
        }}
      >
        {children}
      </form>
    </div>
  );
};

// 바텀시트 해더 컴포넌트 : 자식으로 텍스트를 받는다.
// x 버튼이 있어서 바텀시트 내림이 가능하다.
type SheetHeaderProps = {
  children: string;
};
export const SheetHeader = ({ children }: PropsWithChildren<SheetHeaderProps>) => {
  const [, setIsOepn] = useAtom(isOpenAtom, { store: sheetStore });
  return (
    <div className="sticky top-0 flex items-end justify-center bg-white py-4">
      <div className="relative flex w-full items-end justify-center">
        <h1 className="w-full max-w-[75%] overflow-hidden text-ellipsis whitespace-nowrap text-center text-[17px] font-[600]">
          {children}
        </h1>
        <XIcon
          className="absolute right-0 h-6 w-6 cursor-pointer active:scale-95"
          onClick={() => {
            setIsOepn(false);
          }}
        />
      </div>
    </div>
  );
};

// 바텀시트 푸터 컴포넌트 : 현재는 주황색 버튼임. 자식으로 클래스와 텍스트 칠드런을 받는다.
type SheetFooterProps = {
  children: string;
  className?: string;
};
export const SheetFooter = ({ children, className }: PropsWithChildren<SheetFooterProps>) => {
  const [, setIsOepn] = useAtom(isOpenAtom, { store: sheetStore });
  return (
    <>
      <div className="" />
      <div className={cn(className, 'sticky bottom-0 bg-white py-4')}>
        <button
          className="w-full overflow-hidden text-ellipsis whitespace-nowrap rounded-[8px] bg-[#E85C0D] px-[14px] py-[13px] text-[17px] font-[700] text-white hover:brightness-95 active:brightness-75"
          type="submit"
          onClick={() => {
            setIsOepn(false);
          }}
        >
          {children}
        </button>
      </div>
    </>
  );
};

// 바텀시트 트리거 함수 컴포넌트 : 자식으로 텍스트나 JSX.Element를 받는다.
export const SheetTrigger = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement | HTMLButtonElement>) => {
  // 트리거 함수, 조타이로 세터 함수만 받는다.
  const [, setIsOepn] = useAtom(isOpenAtom, { store: sheetStore });
  // children이 없는 경우
  if (!children) {
    return null;
  }
  // children이 JSX.Element인지 확인.
  if (React.isValidElement(children)) {
    return (
      <div className={cn(className, '')} {...props}>
        {React.cloneElement(children, {
          onClick: () => {
            setIsOepn(true);
          },
          ...props,
        })}
      </div>
    );
  }
  return (
    // children이 JSX.Element이 아니라면 대부분 그냥 원시 표기값들.
    <button
      className={cn(className, '')}
      onClick={() => {
        setIsOepn(true);
      }}
      {...props}
    >
      {children}
    </button>
  );
};

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
