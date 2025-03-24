import { atom } from "jotai";

export const sidebarToggleAtom = atom<any>();
sidebarToggleAtom.debugLabel = "sidebarToggleAtom";

export const isSidebarOpenAtom = atom<boolean>(
  localStorage.getItem("sidebarState") === "open" || false
);
isSidebarOpenAtom.debugLabel = "isSidebarOpenAtom";
