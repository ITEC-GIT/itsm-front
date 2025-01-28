import { atom } from 'jotai';
import { atomWithIndexedDB } from '../atomWithIndexDB';

// Atom to set the data from queries of users(those who have agent) and branches
export const slavesAtom = atomWithIndexedDB<any[]>('slavesAtom', []);
slavesAtom.debugLabel = "slavesAtom";

export const branchesAtom = atomWithIndexedDB<any[]>('branchesAtom', []);
branchesAtom.debugLabel = "branchesAtom";