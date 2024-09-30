import { atom, createStore } from 'jotai';

// 조타이 아톰
export const sheetStore = createStore();
export const isOpenAtom = atom(false);
