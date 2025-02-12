import { atom } from "jotai";
import { StaticDataType } from "../../types/filtersAtomType";
import { atomWithIndexedDB } from "../atomWithIndexDB";

export const staticDataAtom = atomWithIndexedDB<StaticDataType[]>(
  "staticDataAtom",
  []
);
staticDataAtom.debugLabel = "staticDataAtom";
