import { atom, WritableAtom } from 'jotai';
import Dexie from 'dexie';

// Initialize IndexedDB using Dexie
const db = new Dexie('JotaiDB');
db.version(1).stores({
  atoms: '&key', // 'key' is the unique identifier for each atom
});

// Type definitions for data stored in IndexedDB
interface AtomData<T> {
  key: string;
  value: T;
}

// A wrapper function to create atoms that persist in IndexedDB
export function atomWithIndexedDB<T>(
  key: string,
  initialValue: T
): WritableAtom<Promise<T>, [T | ((prev: T) => T)], void> {
  // Base atom for local state
  const baseAtom = atom(initialValue);

  // Read atom to fetch data from IndexedDB
  const readAtom = atom(async (get) => {
    try {
      const storedValue = await db.table<AtomData<T>>('atoms').get(key);
      return storedValue ? storedValue.value : get(baseAtom);
    } catch (error) {
      console.error('Error reading from IndexedDB:', error);
      return get(baseAtom); // Fallback to baseAtom value on error
    }
  });

  // Write atom to update both local state and IndexedDB
  const writeAtom = atom(
    null,
    (get, set, update: T | ((prev: T) => T)) => {
      const newValue =
        typeof update === 'function'
          ? (update as (prev: T) => T)(get(baseAtom))
          : update;

      set(baseAtom, newValue); // Update the base atom

      // Save to IndexedDB
      db.table<AtomData<T>>('atoms')
        .put({ key, value: newValue })
        .catch((error) => {
          console.error('Error writing to IndexedDB:', error);
        });
    }
  );

  // Synced atom that reads and writes to IndexedDB
  const syncedAtom = atom(
    (get) => get(readAtom),
    (get, set, update: T | ((prev: T) => T)) => {
      set(writeAtom, update); // Forward the update to the writeAtom
    }
  );

  return syncedAtom;
}
