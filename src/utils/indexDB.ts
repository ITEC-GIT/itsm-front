import { openDB } from 'idb';
import * as webpack from "webpack";

const DB_NAME = 'DynamicTicketsDB';

const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('DynamicTicketsPinned')) {
        db.createObjectStore('DynamicTicketsPinned', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('DynamicTicketsUnread')) {
        db.createObjectStore('DynamicTicketsUnread', { keyPath: 'id' });
      }
    },
  });
};

export const addItem = async (storeName: string, id: string) => {
  const db = await initDB();
  await db.put(storeName, { id });
};

export const removeItem = async (storeName: string, id: string) => {
  const db = await initDB();
  await db.delete(storeName, id);
};

export const getItems = async (storeName: string) => {
  const db = await initDB();
  const allItems = await db.getAll(storeName);
  return allItems.map((item) => item.id);
};
export const addCommentItem = async (storeName: string, item: { id: string; last_reply_date: string; [key: string]: any }) => {
  const db = await initDB();
  await db.put(storeName, item);
};
export const getCommentsItems = async (storeName: string) => {
  const db = await initDB();
  const allItems = await db.getAll(storeName);
  return allItems;
};
export const itemExists = async (storeName: string, id: string, lastReplyDate: string) => {
  const db = await initDB();
  const allItems = await db.getAll(storeName); // Retrieve all records from IndexedDB

  // Check if any object in the store matches the given id and last_reply_date
  return allItems.some((item: { id: string; last_reply_date: string }) =>
      item.id === id && item.last_reply_date === lastReplyDate
  );
};
export const updateCommentsItem = async (storeName: string, id: number) => {
  const db = await initDB();

  // Fetch the record by id
  const record = await db.get(storeName, id);

  if (record) {
    // Update the `is_read` field to "read"
    const updatedRecord = { ...record, is_read: "read" };

    // Save the updated record back into IndexedDB
    await db.put(storeName, updatedRecord);
  }
};
