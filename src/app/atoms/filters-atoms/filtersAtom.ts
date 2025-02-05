import { atom } from "jotai";
import { atomWithIndexedDB } from "../../indexDB/ConfigWithAtom";
import { StaticDataType } from "../../types/filtersAtomType";

export const staticDataAtom = atomWithIndexedDB<StaticDataType[]>(
  "staticDataAtom",
  []
);
staticDataAtom.debugLabel = "staticDataAtom";
