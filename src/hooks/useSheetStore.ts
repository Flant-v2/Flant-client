import { useAtom } from 'jotai';
import { isOpenAtom, sheetStore } from '@/store/sheetStore';

export const useSheetStore = () => {
  return useAtom(isOpenAtom, { store: sheetStore });
};
