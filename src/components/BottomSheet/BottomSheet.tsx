'use client';

import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
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

export const SheetContent = () => {
  // 뒷배경이 있어야한다.
  // 스르륵이 되어야한다.
  const { isOpen, toggleSheet } = useSheetContext();
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 top-0 z-50 ${isOpen ? '' : 'hidden'}`}
      onClick={toggleSheet}
    />
  );
};
export const SheetHeader = () => {
  return <div>SheetHeader</div>;
};
export const SheetFooter = () => {
  return <div>SheetFooter</div>;
};

export const SheetTrigger = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  // 트리거 함수
  return <div className={cn(className, '')} {...props} />;
};

/**
 * Sheet가 생성될때 전역이 필요할까?
 * 열리고 닫히고는 사실 한 컴포넌트로 해도 되는데
 * 아니면 그냥 그자리에서 즉시 생성하는 건가?
 *
 * 자식 컴포넌트들이 뭐가 있는지 Sheet에서 인지하고 있어야한다.
 * 상태을 어디다두지?
 * 아무래도 Sheet 컴포넌트 안에 상태를 두는것이 맞을거 같아.
 * 왠만한거는 받아서 쓰자 => 자유도를 높이자
 * 최소한의 것들을 컨트롤해주기
 * 열리고 닫히고 이부분만 나는 신경을 써주면 돼요.
 *
 * 내가 props로 내려주지 않았는데 그냥 자식으로만 값을 내려줬는데 해당 값들을 자식 컴포넌트가 건드릴수 있을까? => 이게 전역 상태구나...
 *
 * 답은 컨택스트였어..... 이걸 조타이로?
 *
 * 로컬 전역으로 만들어주고 react.Memo를 이용해서 해당 컴포넌트를 랩핑해서 메모이제이션처리를 해준다.
 */
