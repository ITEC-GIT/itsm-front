import { openDB } from 'idb';

const DB_NAME = 'TicketsDB';
const STORE_NAME = 'PinnedTickets';

const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
};

export const addPinnedTicketId = async (id: string) => {
  const db = await initDB();
  await db.put(STORE_NAME, { id });
};

export const removePinnedTicketId = async (id: string) => {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
};

export const getPinnedTicketIds = async () => {
  const db = await initDB();
  const allPinned = await db.getAll(STORE_NAME);
  return allPinned.map((item) => item.id);
};