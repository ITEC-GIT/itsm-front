import React, { Suspense, useEffect } from "react";
import { useAtom, useAtomValue } from "jotai";
import { sshHistoryAtom } from "../../atoms/hypercommands-atoms/remote-ssh-atom";
import { FaKey } from "react-icons/fa";

const UserSessionsContent = () => {
  // const [sshHistory] = useAtom(sshHistoryAtom);
  const [sshHistory, setSshHistory] = useAtom(sshHistoryAtom);

  useEffect(() => {
    console.log("🔥 sshHistory changed", sshHistory);
  }, [sshHistory]);

  return sshHistory.length ? (
    <ul className="list-unstyled m-0">
      {sshHistory.map((entry, index) => (
        <li key={index} className="d-flex align-items-center mb-2 ms-2">
          <div className="bg-dark me-2 d-flex justify-content-center p-1">
            <FaKey className="text-warning" />
          </div>
          <span>
            {entry.host} - {entry.computerName}
          </span>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-muted ms-2">No history found.</p>
  );
};

const UserSessions = () => (
  <div className="p-1 border rounded bg-light h-100" style={{ maxWidth: 250 }}>
    <h6 className="fw-bold">User sessions</h6>
    <Suspense fallback={<p className="text-muted ms-2">Loading...</p>}>
      <UserSessionsContent />
    </Suspense>
  </div>
);

export { UserSessions };
