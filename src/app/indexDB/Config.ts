export function openDB(
  userId: number,
  DB_NAME: string,
  STORE_NAMES: string | string[],
  DB_VERSION: number = 1
) {
  const userSpecificDbName = `${DB_NAME}_${userId}`;
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(userSpecificDbName, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBRequest).result;
      const stores = Array.isArray(STORE_NAMES) ? STORE_NAMES : [STORE_NAMES];

      stores.forEach((store) => {
        if (!db.objectStoreNames.contains(store)) {
          db.createObjectStore(store, { keyPath: "id" });
        }
      });
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result);
    };

    request.onerror = (event) => {
      reject(
        new Error(
          "Error opening IndexedDB: " + (event.target as IDBRequest).error
        )
      );
    };
  });
}

export function saveToIndexedDB(
  userId: number,
  DB_NAME: string,
  STORE_NAME: string,
  data: any
) {
  return openDB(userId, DB_NAME, STORE_NAME).then((db) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    data.forEach((item: any, index: number) => {
      if (!item.id) {
        item.id = index;
        console.warn(
          `Auto-generated ID for item in store "${STORE_NAME}": ${item.id}`
        );
      }
      console.log("item ==>>", item);
      const request = store.put(item);
      request.onsuccess = () => console.log(`Saved item with id: ${item.id}`);
      request.onerror = () =>
        console.error(`Error saving item with id: ${item.id}`);
    });

    return new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () =>
        reject(new Error("Error saving to IndexedDB"));
    });
  });
}

export function loadFromIndexedDB(
  userId: number,
  DB_NAME: string,
  STORE_NAME: string
) {
  return openDB(userId, DB_NAME, STORE_NAME).then((db) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    return new Promise<any>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(new Error("Error loading from IndexedDB"));
    });
  });
}

export function removeFromIndexedDB(
  userId: number,
  DB_NAME: string,
  STORE_NAME: string,
  targetId: number
) {
  return openDB(userId, DB_NAME, STORE_NAME).then((db) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const request = store.delete(targetId);

    return new Promise<void>((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () =>
        reject(new Error("Error deleting from IndexedDB"));
    });
  });
}

export function clearIndexedDB(
  userId: number,
  DB_NAME: string,
  STORE_NAME: string
) {
  return openDB(userId, DB_NAME, STORE_NAME).then((db) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    return new Promise<void>((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error("Error clearing IndexedDB"));
    });
  });
}

export function deleteDB(DB_NAME: string) {
  return new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(new Error("Error deleting IndexedDB"));
  });
}

export async function dataMissingInIndexedDB(
  userId: number,
  DB_NAME: string,
  STORE_NAMES: string[]
) {
  let missingStores: string[] = [];

  try {
    const db = await openDB(userId, DB_NAME, STORE_NAMES);

    for (const store of STORE_NAMES) {
      if (!db.objectStoreNames.contains(store)) {
        missingStores.push(store);
      } else {
        const data = await loadFromIndexedDB(userId, DB_NAME, store);
        if (!data || data.length === 0) {
          missingStores.push(store);
        }
      }
    }
    return missingStores;
  } catch (error) {
    console.error("Error in checkAndFetchData:", error);
    return [];
  }
}
