import { atom } from 'jotai';
import {atomWithIndexedDB} from "../atomWithIndexDB.ts";

// Atom to set the data from indexDB of all static data such as branches,types,priorities,urgencies to be used later and have their ids for updating them
export const staticDataAtom = atomWithIndexedDB<any[]>('staticDataAtom', []);
staticDataAtom.debugLabel = "staticDataAtom";


// compares authenticated user if he is master
export const isCurrentUserMasterAtom = atom(false);
isCurrentUserMasterAtom.debugLabel = "isCurrentUserMasterAtom";