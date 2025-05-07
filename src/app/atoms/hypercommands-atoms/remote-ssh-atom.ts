
import { atomWithFromIndexedDB } from "./atomWithFromIndexDB";

export const sshHistoryAtom = atomWithFromIndexedDB<any[]>(
  "sshHistoryAtom",
  []
);
sshHistoryAtom.debugLabel = "sshHistoryAtom";
