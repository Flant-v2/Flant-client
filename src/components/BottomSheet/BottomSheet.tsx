'use client';

import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { XIcon } from '@/icons';
import { cn } from '@/utils/styles';

type SheetContextProps = {
  isOpen: boolean;
  toggleSheet: () => void;
};
// SheetContext는 외부에 정의되어야 자식들이 참조할 수 있습니다.
const SheetContext = createContext<SheetContextProps | null>(null);
const Sheet = ({ children }: PropsWithChildren) => {
  // 상태들 => 열리고 닫히고 상태
  const [isOpen, setIsOpen] = useState(false);
  const scrollPositionRef = useRef<null | number>(null);
  const toggleSheet = useCallback(() => {
    setIsOpen(prev => !prev); // 열리고 닫히는 상태 변경
  }, []);
  const contextValue = useMemo(
    () => ({
      isOpen,
      toggleSheet,
    }),
    [isOpen, toggleSheet, SheetContext]
  );
  useEffect(() => {
    if (isOpen) {
      scrollPositionRef.current = preventScroll();
    } else {
      scrollPositionRef.current && allowScroll(scrollPositionRef.current);
    }
  }, [isOpen]);
  return <SheetContext.Provider value={contextValue}>{children}</SheetContext.Provider>;
};
export const MemoizedSheet = React.memo(Sheet);

export const useSheetContext = () => {
  const context = useContext(SheetContext);
  if (!context) {
    throw new Error('useSheetContext must be used within a Sheet');
  }
  return context;
};

type SheetContentProps = {
  onSubmit?: () => void;
};
export const SheetContent = ({ children, onSubmit }: PropsWithChildren<SheetContentProps>) => {
  // 뒷배경이 있어야한다.
  // 스르륵이 되어야한다.
  const { isOpen, toggleSheet } = useSheetContext();

  return (
    <div className={isOpen ? '' : 'hidden'}>
      <div className="fixed bottom-0 left-0 right-0 top-0 z-40 bg-black/20" onClick={toggleSheet} />
      <form
        className="fixed bottom-0 left-0 right-0 z-50 max-h-[calc(100vh-60px)] overflow-y-scroll bg-white px-4"
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
export const SheetHeader = ({ children }: PropsWithChildren) => {
  const { toggleSheet } = useSheetContext();
  return (
    <div className="sticky top-0 flex items-end justify-center bg-white py-4">
      <div className="relative flex w-full items-end justify-center">
        <h1 className="w-full max-w-[75%] overflow-hidden text-ellipsis whitespace-nowrap text-center text-[17px] font-[600]">
          {children}
        </h1>
        <XIcon
          className="absolute right-0 h-6 w-6 cursor-pointer active:scale-95"
          onClick={toggleSheet}
        />
      </div>
    </div>
  );
};
type SheetFooterProps = {
  children: string;
  className?: string;
};
export const SheetFooter = ({ children, className }: PropsWithChildren<SheetFooterProps>) => {
  const { toggleSheet } = useSheetContext();
  return (
    <>
      <div className="" />
      <div className={cn(className, 'sticky bottom-0 bg-white py-4')}>
        <button
          className="w-full overflow-hidden text-ellipsis whitespace-nowrap rounded-[8px] bg-[#E85C0D] px-[14px] py-[13px] text-[17px] font-[700] text-white hover:brightness-95 active:brightness-75"
          type="submit"
          onClick={toggleSheet}
        >
          {children}
        </button>
      </div>
    </>
  );
};

export const SheetTrigger = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement | HTMLButtonElement>) => {
  // 트리거 함수
  const { toggleSheet } = useSheetContext();
  if (!children) {
    return null;
  }
  // children이 JSX.Element인지 확인
  if (React.isValidElement(children)) {
    return (
      <div className={cn(className, '')} {...props}>
        {React.cloneElement(children, {
          onClick: toggleSheet,
          ...props,
        })}
      </div>
    );
  }
  return (
    <button className={cn(className, '')} onClick={toggleSheet} {...props}>
      {children}
    </button>
  );
};

/**
 * 스크롤을 방지하고 현재 위치를 반환한다.
 * @returns {number} 현재 스크롤 위치
 */
export const preventScroll = () => {
  const currentScrollY = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
  document.body.style.top = `-${currentScrollY}px`; // 현재 스크롤 위치
  document.body.style.overflowY = 'scroll';
  return currentScrollY;
};

/**
 * 스크롤을 허용하고, 스크롤 방지 함수에서 반환된 위치로 이동한다.
 * @param prevScrollY 스크롤 방지 함수에서 반환된 스크롤 위치
 */
export const allowScroll = (prevScrollY: number) => {
  document.body.style.position = '';
  document.body.style.width = '';
  document.body.style.top = '';
  document.body.style.overflowY = '';
  window.scrollTo(0, prevScrollY);
};
