import { atom } from 'jotai';

// Atom to set the data from queries of users(those who have agent) and branches
export const slavesAtom = atom<any[]>([]);
slavesAtom.debugLabel = "slavesAtom";

export const branchesAtom = atom<any[]>([]);
branchesAtom.debugLabel = "branchesAtom";