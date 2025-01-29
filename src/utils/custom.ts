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
