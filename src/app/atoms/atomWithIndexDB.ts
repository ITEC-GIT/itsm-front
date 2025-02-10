import { atom, WritableAtom } from 'jotai';
import Dexie from 'dexie';
import Cookies from "js-cookie";

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
): WritableAtom<T, [T | ((prev: T) => T)], void> {
    // Base atom for local state
    const baseAtom = atom(initialValue);
    function getUserIdFromCookie() {
        const match = Cookies.get('user');
        return match ? match : null;
    }

    // Read atom to fetch data from IndexedDB
    const readAtom = atom((get) => {
        let storedValue: AtomData<T> | undefined;
        const userId = getUserIdFromCookie();
        const userScopedKey = `${userId}-${key}`;
        db.table<AtomData<T>>('atoms').get(userScopedKey).then(value => {
            storedValue = value;
        }).catch(error => {
            console.error('Error reading from IndexedDB:', error);
        });
        return storedValue ? storedValue.value : get(baseAtom);
    });

    // Write atom to update both local state and IndexedDB
    const writeAtom = atom(
        null,
        async (get, set, update: T | ((prev: T) => T)) => {
            const newValue =
                typeof update === 'function'
                    ? (update as (prev: T) => T)(get(baseAtom))
                    : update;

            set(baseAtom, newValue); // Update the base atom

            // Save to IndexedDB
            try {
                const userId = getUserIdFromCookie();
                key = `${userId}-${key}`;
                await db.table<AtomData<T>>('atoms').put({ key, value: newValue });
            } catch (error) {
                console.error('Error writing to IndexedDB:', error);
            }
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