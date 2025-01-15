import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { initialUserState, UserAtomType } from "../../types/AuthTypes";

export const userAtom = atomWithStorage<UserAtomType>(
  "userProfile",
  initialUserState
);

// export const userAtom = atom<UserAtomType>(initialUserState);
userAtom.debugLabel = "userAtom";

export const isAuthenticatedAtom = atom(false);
isAuthenticatedAtom.debugLabel = "isAuthenticatedAtom";
