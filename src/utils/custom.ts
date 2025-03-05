import { loadFromIndexedDB } from "../app/indexDB/Config";

export const getStatusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case "initialized":
      return "status-initialized";
    case "received":
      return "status-received";
    case "canceled":
      return "status-canceled";
    default:
      return "status-default";
  }
};

export const getCircleColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "initialized":
      return "orange";
    case "received":
      return "green";
    case "canceled":
      return "red";
    default:
      return "gray";
  }
};

export const getLowestId = (dataArray: any[]) => {
  if (dataArray.length === 0) return null;
  return Math.min(...dataArray.map((data) => data.id));
};

export const getGreatestId = (dataArray: any[]) => {
  if (dataArray.length === 0) return null;
  return Math.max(...dataArray.map((data) => data.id));
};

export const formatName = (name: string) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

//load from indexedDB into select
export const getData = async (
  storeName: string,
  userId: number,
  dbName: string
) => {
  const data = await loadFromIndexedDB(userId, dbName, storeName);
  return data.map((item: any) => ({ value: item.id, label: item.name }));
};

// yyyy-MM-dd
export const formatDate = (date: Date | null) => {
  if (!date) return null;
  return date.toISOString().split("T")[0];
};

export const deepEqual = (obj1: any, obj2: any): boolean => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

export const getBackgroundColor = (
  category: string,
  categories: string[],
  colors: string[]
): string => {
  const index = categories.indexOf(category);
  if (index !== -1) {
    return colors[index];
  }
  return "#e8e9e9";
};
