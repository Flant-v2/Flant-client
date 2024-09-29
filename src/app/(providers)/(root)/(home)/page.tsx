import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from '@/components/BottomSheet';

const HomePage = () => {
  return (
    <div>
      하이
      <Sheet>
        <SheetTrigger>버튼</SheetTrigger>
        <SheetTrigger>
          <button>버튼</button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>제목입니다.</SheetHeader>

          <SheetFooter />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default HomePage;
