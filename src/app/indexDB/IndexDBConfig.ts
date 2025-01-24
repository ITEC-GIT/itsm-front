export function openDB(
    userId: number,
    DB_NAME: string,
    STORE_NAME: string,
    DB_VERSION: number = 1
  ) {
    const userSpecificDbName = `${DB_NAME}_${userId}`;
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(userSpecificDbName, DB_VERSION);
  
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBRequest).result;
  
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id" });
        }
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
  
      // Ensure data is an array
      const dataArray = Array.isArray(data) ? data : [data];
  
      dataArray.forEach((item: any, index: number) => {
        if (!item.id) {
          item.id = index + 1; // Assign a unique id if missing
        }
        const request = store.put(item);
        request.onsuccess = () => console.log(`Saved item `);
        request.onerror = () =>
          console.error(`Error saving item`);
      });
  
      return new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () =>
          reject(new Error("Error saving to IndexedDB"));
      });
    });
  }
  
  // retrieve all stored data from the store
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
  