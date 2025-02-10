import { atom } from 'jotai';
import {atomWithIndexedDB} from '../atomWithIndexDB';
// Atom to set the data from queries of users(those who have agent) and branches
export const slavesAtom = atomWithIndexedDB<any[]>('slavesAtom', []);
slavesAtom.debugLabel = "slavesAtom"

// the branches of the ITSM
export const branchesAtom = atomWithIndexedDB<any[]>('branchesAtom', []);
branchesAtom.debugLabel = "branchesAtom";

// the asssignees and the it support personnels that must be loaded at approutes
export const mastersAtom = atomWithIndexedDB<any[]>('mastersAtom', []);
mastersAtom.debugLabel = "mastersAtom";

