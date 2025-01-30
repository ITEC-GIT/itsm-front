import { atom } from 'jotai';

// Atom to set the data from indexDB of all static data such as branches,types,priorities,urgencies to be used later and have their ids for updating them
export const staticDataAtom = atom<any[]>([]);
staticDataAtom.debugLabel = "staticDataAtom";


// compares authenticated user if he is master
export const isCurrentUserMasterAtom = atom(false);
isCurrentUserMasterAtom.debugLabel = "isCurrentUserMasterAtom";