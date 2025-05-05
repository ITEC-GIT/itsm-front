import { atomWithIndexedDB } from "../atomWithIndexDB";

export const sshHistoryAtom = atomWithIndexedDB<any[]>("sshHistoryAtom", []);
sshHistoryAtom.debugLabel = "sshHistoryAtom";
