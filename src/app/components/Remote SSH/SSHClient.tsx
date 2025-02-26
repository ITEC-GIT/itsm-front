import React, { useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

interface SSHClientProps {
  hostname: string;
  credentials: {
    username: string;
    password: string;
  };
}

const SSHClient = ({ hostname, credentials }: SSHClientProps) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const term = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    term.current = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      theme: {
        background: "#000000",
        foreground: "#FFFFFF",
      },
    });

    fitAddon.current = new FitAddon();
    term.current.loadAddon(fitAddon.current);

    if (terminalRef.current) {
      term.current.open(terminalRef.current);
      fitAddon.current.fit();
    }

    term.current.onData((data) => {
      if (socketRef.current && connected) {
        socketRef.current.send(JSON.stringify({ command: data }));
      }
    });

    return () => {
      socketRef.current?.close();
      term.current?.dispose();
    };
  }, [connected]);

  const connectSSH = () => {
    socketRef.current = new WebSocket(
      import.meta.env.VITE_APP_ITSM_GLPI_SSH_WEB_SOCKET
    )
    socketRef.current.onopen = () => {
      socketRef.current?.send(
        JSON.stringify({
          type: "connect",
          host: hostname,
          port: "22",
          username: credentials.username,
          password: credentials.password,
        })
      );
      setConnected(true);
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.output && term.current) {
        term.current.write(data.output);
      }
    };

    socketRef.current.onerror = (error) =>
      console.error("WebSocket Error:", error);
    socketRef.current.onclose = () => setConnected(false);
  };

  return (
    <div>
      <div
        ref={terminalRef}
        style={{ width: "100%", height: "400px", background: "black" }}
      />
    </div>
  );
};

export default SSHClient;
