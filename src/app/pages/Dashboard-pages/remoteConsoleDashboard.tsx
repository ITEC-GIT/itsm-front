import { useEffect, useRef, useState } from "react";
import AnimatedRouteWrapper from "../../routing/AnimatedRouteWrapper.tsx";
import { DisconnectButton } from "../../components/form/stepsButton.tsx";
import VncScreen from "../../lib/VNC/VncScreen.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { activeDashboardViewAtom } from "../../atoms/dashboard-atoms/dashboardAtom.ts";
import { useSetAtom } from "jotai";

const RemoteConsoleDashboardComponent = () => {
  const { computerId, computerIp } = useParams<{
    computerId: string;
    computerIp: string;
  }>();

  const navigate = useNavigate();
  const vncScreenRef = useRef<React.ElementRef<typeof VncScreen>>(null);
  const [websocketUrl, setWebSocketUrl] = useState<string>("");
  const setActiveView = useSetAtom(activeDashboardViewAtom);
  const handleEndSession = async () => {
    if (!computerId || !computerIp) return;

    try {
      await fetch(`http://localhost:8004/vnc/disconnect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: computerId,
          vnc_ip: computerIp,
        }),
      });
    } catch (error) {
      console.error("Failed to notify backend of disconnect", error);
    }
  };

  const handleDisconnect = () => {
    if (vncScreenRef.current) {
      vncScreenRef.current.disconnect();
    }
    handleEndSession();
    setWebSocketUrl("");
    setActiveView("");
    navigate("/dashboard");
  };

  useEffect(() => {
    if (!computerId || !computerIp) {
      navigate("/dashboard");
    }
  }, [computerId, computerIp, navigate]);

  return (
    <AnimatedRouteWrapper>
      <div className="d-flex flex-column h-100">
        <div className="d-flex justify-content-end p-2">
          <DisconnectButton onClick={handleDisconnect} />
        </div>

        {/* VNC Screen */}
        <div className="flex-grow-1 p-2 d-flex">
          <div className="w-100 h-100">
            <VncScreen
              url={websocketUrl}
              scaleViewport
              background="#000000"
              style={{ width: "100%", height: "100%" }}
              debug
              ref={vncScreenRef}
              onDisconnect={(event: CustomEvent<{ clean: boolean }>) => {
                handleEndSession();
                setWebSocketUrl("");
              }}
            />
          </div>
        </div>
      </div>
    </AnimatedRouteWrapper>
  );
};

export { RemoteConsoleDashboardComponent };
