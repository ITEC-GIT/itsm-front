import { atom } from "jotai";

export const dashboardViewAtom = atom<"main" | "analytics">("main");
dashboardViewAtom.debugLabel = "dashboardViewAtom";

export const selectedComputerDashboardAtom = atom<number>();
selectedComputerDashboardAtom.debugLabel = "selectedComputerDashboardAtom";

export const activeDashboardViewAtom = atom<string | null>(null);
activeDashboardViewAtom.debugLabel = "activeDashboardViewAtom";
