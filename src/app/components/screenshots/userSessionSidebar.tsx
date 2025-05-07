import React, { useEffect } from "react";
import { useAtom } from "jotai";
import { sshHistoryAtom } from "../../atoms/hypercommands-atoms/remote-ssh-atom";
import { FaKey } from "react-icons/fa";

type UserSessionsProps = {
  onSelectHistory?: (entry: any) => void;
};

const UserSessionsContent = ({
  onSelectHistory,
}: {
  onSelectHistory?: (entry: any) => void;
}) => {
  const [sshHistory] = useAtom(sshHistoryAtom);

  return sshHistory.length ? (
    <ul className="list-unstyled m-0">
      {[...sshHistory].reverse().map((entry, index) => (
        <li
          key={index}
          className="d-flex align-items-center mb-2 ms-2 cursor-pointer"
          onClick={() => onSelectHistory?.(entry)}
          style={{ cursor: "pointer" }}
        >
          <div className="d-flex align-items-start">
            <div className="me-2 d-flex justify-content-center p-1">
              <FaKey className="text-warning" />
            </div>
            <span className="d-block">
              {entry.host} - {entry.computerName}
            </span>
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-muted ms-2">No history found.</p>
  );
};

const UserSessions = ({ onSelectHistory }: UserSessionsProps) => (
  <div className="p-1 border rounded bg-light h-100">
    <h6 className="fw-bold">User sessions</h6>
    <UserSessionsContent onSelectHistory={onSelectHistory} />
  </div>
);

export { UserSessions };
