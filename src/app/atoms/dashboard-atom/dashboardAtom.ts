import { atom } from "jotai";

export const dashboardViewAtom = atom<"main" | "analytics">("main");
dashboardViewAtom.debugLabel = "dashboardViewAtom";
