import { atom } from 'jotai';

export const selectedAssigneesAtom = atom<{ value: string; label: string }[]>([]);
selectedAssigneesAtom.debugLabel = "selectedAssigneesAtom";