import { openDB } from 'idb';

const DB_NAME = 'DynamicTicketsDB';

const initDB = async (storeName: string) => {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { keyPath: 'id' });
            }
        },
    });
};

export const addItem = async (storeName: string, id: string) => {
    const db = await initDB(storeName);
    await db.put(storeName, { id });
};

export const removeItem = async (storeName: string, id: string) => {
    const db = await initDB(storeName);
    await db.delete(storeName, id);
};

export const getItems = async (storeName: string) => {
    const db = await initDB(storeName);
    const allItems = await db.getAll(storeName);
    return allItems.map((item) => item.id);
};
