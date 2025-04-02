import { useEffect, useState } from "react";

const useWebSocket = (userId: number) => {
    const [messages, setMessages] = useState<{ ticket_id: number; message: string }[]>([]);
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        if (!userId) return;
        // add bearer to security
        const ws = new WebSocket(`ws://localhost:8000/tickets_unprotected/ws/${userId}`);

        ws.onopen = () => console.log("✅ WebSocket Connected");

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prev) => [...prev, data]); // Append new messages
        };

        ws.onerror = (error) => console.error("❌ WebSocket Error", error);

        ws.onclose = () => console.log("❌ WebSocket Disconnected");

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, [userId]);

    return { messages, socket };
};

export default useWebSocket;
