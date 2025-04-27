import { useEffect, useState } from "react";

const useWebSocket = (userId: number, token: string) => {
    const [messages, setMessages] = useState<{ ticket_id: number; message: string }[]>([]);
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        if (!userId || !token) return;

        // Attach Bearer Token as a query parameter
        const ws = new WebSocket(`ws://localhost:8000/tickets_unprotected/ws/${userId}?token=${token}`);

        ws.onopen = () => console.log("✅ WebSocket Connected");

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log(data)
                setMessages((prev) => [...prev, data]); // Append new messages
            } catch (error) {
                console.error("❌ Error parsing WebSocket message:", error);
            }
        };

        ws.onerror = (error) => console.error("❌ WebSocket Error", error);

        ws.onclose = () => console.log("❌ WebSocket Disconnected");

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, [userId, token]); // Reconnect when userId or token changes

    return { messages, socket };
};

export default useWebSocket;
