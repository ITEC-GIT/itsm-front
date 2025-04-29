import React, { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

interface TerminalDisplayProps {
  sessionId: string;
}

const TerminalDisplay: React.FC<TerminalDisplayProps> = ({ sessionId }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const term = useRef<Terminal | null>(null);
  const fitAddon = useRef(new FitAddon());
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    term.current = new Terminal({
      cursorBlink: true,
      allowProposedApi: true,
      fontFamily: 'Consolas, "Courier New", monospace',
    });

    term.current.loadAddon(fitAddon.current);
    term.current.open(terminalRef.current);
    fitAddon.current.fit();
    const base_ssh_url=import.meta.env.VITE_APP_ITSM_SSH;
    const base_ssh_url_webscoket = base_ssh_url.replace(/^https?:\/\//, '');

    const ws = new WebSocket(
        `ws://${base_ssh_url_webscoket}/ws/ssh?session_id=${sessionId}`
    );
    wsRef.current = ws;

    ws.onopen = () => {
      term.current?.write("\r\nConnected to SSH server...\r\n");
    };

    ws.onmessage = (event) => {
      term.current?.write(event.data);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      term.current?.write("\r\nWebSocket connection error.\r\n");
    };

    term.current.onData((data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(data);
      }
    });

    return () => {
      ws.close();
      term.current?.dispose();
    };
  }, [sessionId]);

  return (
    <div
      ref={terminalRef}
      style={{
        height: "100%",
        width: "100%",
        backgroundColor: "#1e1e1e",
        padding: "8px",
        borderRadius: "4px",
      }}
    />
  );
};

export { TerminalDisplay };
