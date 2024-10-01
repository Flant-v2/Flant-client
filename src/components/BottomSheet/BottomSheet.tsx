'use client';

import React, { PropsWithChildren, useRef } from 'react';
import { Provider } from 'jotai';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useSheetStore } from '@/hooks/useSheetStore';
import { useSheetTransition } from '@/hooks/useSheetTransition';
import { XIcon } from '@/icons';
import { sheetStore } from '@/store/sheetStore';
import { cn } from '@/utils/styles';

const Sheet = ({ children }: PropsWithChildren) => {
  // 상태들 => 열리고 닫히고 상태 조타이로 관리!
  const [isOpen] = useSheetStore();
  // 별도 훅으로 분리해서 관리
  useBodyScrollLock(isOpen);
  return <Provider store={sheetStore}>{children}</Provider>;
};

// 바텀시트 컨텐츠 : 자식과 버튼으로 제출시 처리될 onSubmit 함수를 받는다.
type SheetContentProps = {
  onSubmit?: () => void;
};
export const SheetContent = ({ children, onSubmit }: PropsWithChildren<SheetContentProps>) => {
  const [isOpen, setIsOepn] = useSheetStore();
  const formRef = useRef<HTMLFormElement | null>(null);
  const sheetMount = useSheetTransition({ isOpen, ref: formRef });

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
export const SheetHeader = ({ children }: SheetHeaderProps) => {
  const [, setIsOepn] = useSheetStore();

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
export const SheetFooter = ({ children, className }: SheetFooterProps) => {
  const [, setIsOepn] = useSheetStore();

  return (
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
  );
};

// 바텀시트 트리거 함수 컴포넌트 : 자식으로 텍스트나 JSX.Element를 받는다.
export const SheetTrigger = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement | HTMLButtonElement>) => {
  // 트리거 함수, 조타이로 세터 함수만 받는다.
  const [, setIsOepn] = useSheetStore();
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

export const MemoizedSheet = React.memo(Sheet);
