import { atom } from "jotai";

//should handle this
export const currentAssetsPageAtom = atom(1);
currentAssetsPageAtom.debugLabel = "currentAssetsPageAtom";

export const selectedComputerInfoAtom = atom<any>();
selectedComputerInfoAtom.debugLabel = "selectedComputerInfoAtom";

export const computerMetricsAtom = atom<any>();
computerMetricsAtom.debugLabel = "computerMetricsAtom";
