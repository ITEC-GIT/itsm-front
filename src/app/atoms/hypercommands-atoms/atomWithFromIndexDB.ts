import { atom } from "jotai";
import Dexie from "dexie";
import Cookies from "js-cookie";

const db = new Dexie("JotaiDB");
db.version(1).stores({
  atoms: "&key", 
});

interface AtomData<T> {
  key: string;
  value: T;
}

export function atomWithFromIndexedDB<T>(key: string, initialValue: T) {
  const baseAtom = atom<T>(initialValue);

  baseAtom.onMount = (setAtom) => {
    const userId = Cookies.get("username") || "";
    const scopedKey = `${userId}-${key}`;

    db.table<AtomData<T>>("atoms")
      .get(scopedKey)
      .then((stored) => {
        if (stored?.value !== undefined) {
          setAtom(stored.value);
        }
      })
      .catch((err) => {
        console.error("Error reading from IndexedDB on mount:", err);
      });
  };

  return atom(
    (get) => get(baseAtom),
    async (get, set, update: T | ((prev: T) => T)) => {
      const userId = Cookies.get("username") || "";
      const scopedKey = `${userId}-${key}`;
      const prev = get(baseAtom);
      const newValue =
        typeof update === "function" && update.length === 1
          ? (update as (prev: T) => T)(prev)
          : (update as T);

      set(baseAtom, newValue);

      try {
        await db
          .table<AtomData<T>>("atoms")
          .put({ key: scopedKey, value: newValue });
      } catch (error) {
        console.error("Error writing to IndexedDB:", error);
      }
    }
  );
}
