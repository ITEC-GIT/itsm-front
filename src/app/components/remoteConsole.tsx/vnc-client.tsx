// import RFB from "novnc-core";
// import React, { useEffect, useRef, useState } from "react";

// const VNCClient = ({ vncUrl }: { vncUrl: string }) => {
//   const vncScreenRef = useRef(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     try {
//       if (vncScreenRef.current) {
//         const rfb = new RFB(vncScreenRef.current);
//         const url = new URL(vncUrl);
//         rfb.connect(
//           url.hostname,
//           Number(url.port) || 5900,
//           url.pathname.substring(1)
//         );
//         setIsConnected(true);
//         setError(null);

//         rfb.set_view_only(false);
//         rfb.set_viewportDrag(true);

//         rfb.disconnect = () => {
//           setIsConnected(false);
//           setError("Disconnected from VNC server.");
//         };

//         rfb.get_onPasswordRequired = () => {
//           return (rfb: RFB, msg?: string) => {
//             const password = prompt("Enter VNC password:");
//             if (password) rfb.sendPassword(password);
//             else setError("Password is required.");
//           };
//         };

//         return () => {
//           rfb.disconnect();
//         };
//       }
//     } catch (err) {
//       setError("Error initializing VNC client.");
//     }
//   }, [vncUrl]);

//   return (
//     <div className="container mt-4">
//       <h2 className="mb-3">VNC Remote Desktop</h2>
//       {error && (
//         <div className="alert alert-danger" role="alert">
//           {error}
//         </div>
//       )}
//       <div
//         ref={vncScreenRef}
//         className="border rounded"
//         style={{ width: "100%", height: "600px", backgroundColor: "#000" }}
//       />
//       <div className="mt-3">
//         <p className={isConnected ? "text-success" : "text-danger"}>
//           {isConnected ? "Connected" : "Not Connected"}
//         </p>
//       </div>
//     </div>
//   );
// };

// export { VNCClient };
