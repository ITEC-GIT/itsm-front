interface TicketResponse {
    count: number;
    totalcount: number;
    data: any;
  }
interface Assignee {
    id: number;
    name: string;
    avatar?: string;
    assigner?: any;
  }
interface ImageUploadData {
    base64: string;
    url?: string; // Optional, as it will be assigned after upload
}
interface ImageUploadResponse {
    url: string;           // Full URL of the uploaded image
    saved_file: string;    // The filename stored on the server
    hash: string;          // Unique hash of the file
    size: number;          // Size of the file in bytes
}

export type { TicketResponse, Assignee ,ImageUploadData,ImageUploadResponse};
