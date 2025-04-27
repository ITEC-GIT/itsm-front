import { atom } from "jotai";
import { UserPrerequisitesType } from "../../types/user-management";

export const usersPrerequisitesAtom = atom<UserPrerequisitesType>();
usersPrerequisitesAtom.debugLabel = "usersPrerequisitesAtom";
