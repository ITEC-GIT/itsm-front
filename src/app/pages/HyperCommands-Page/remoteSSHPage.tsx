import { useState } from "react";
import { ActionIcons } from "../../components/hyper-commands/action-icons";
import Select from "react-select";
import { Content } from "../../../_metronic/layout/components/content/Content";

const RemoteSSHPage = () => {
  const [connected, setConnected] = useState<boolean>(false);
  const [hostname, setHostname] = useState<string | null>(null);
  const [port, setPort] = useState<number | string>("");
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertVariant, setAlertVariant] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const computers = [
    { label: "Computer A - 192.168.1.1", value: "192.168.1.1" },
    { label: "Computer B - 192.168.1.2", value: "192.168.1.2" },
    { label: "Computer C - 192.168.1.3", value: "192.168.1.3" },
  ];

  const validateHostname = (hostname: string) => {
    const regex =
      /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)$|^([0-9]{1,3}\.){3}[0-9]{1,3}$/;
    return regex.test(hostname);
  };

  const validatePort = (port: string | number) => {
    return Number(port) > 0;
  };

  const validateCredentials = () => {
    if (!username || !password) {
      setAlertMessage("Please enter both username and password.");
      setAlertVariant("danger");
      return false;
    }
    return true;
  };

  const handleConnect = () => {
    if (!hostname || !port) {
      setAlertMessage("Please provide both hostname and port.");
      setAlertVariant("danger");
      return;
    }

    if (!validateHostname(hostname as string)) {
      setAlertMessage(
        "Invalid hostname. Please enter a valid hostname or IP address."
      );
      setAlertVariant("danger");
      return;
    }

    if (!validatePort(port)) {
      setAlertMessage("Port must be a positive number.");
      setAlertVariant("danger");
      return;
    }

    if (!validateCredentials()) return;

    setConnected(true);
    setAlertMessage("Connected to server successfully!");
    setAlertVariant("success");
  };

  const handleReset = () => {
    setHostname(null);
    setPort("");
    setUsername("");
    setPassword("");
    setAlertMessage("");
    setAlertVariant("");
    setConnected(false);
  };

  return (
    <Content>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-10 col-xl-12">
            <h2 className="text-center mb-4">🔐 Remote SSH</h2>
            <ActionIcons />
            <form className="p-4 shadow-sm bg-light rounded">
              <div className="mb-3">
                <label htmlFor="hostnameInput" className="form-label">
                  Hostname/IP
                </label>
                <Select
                  id="hostnameInput"
                  options={computers}
                  value={
                    hostname
                      ? { label: `${hostname} - ${hostname}`, value: hostname }
                      : null
                  }
                  onChange={(selectedOption) =>
                    setHostname(selectedOption?.value || null)
                  }
                  placeholder="Select a computer or enter IP"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="portInput" className="form-label">
                  Port
                </label>
                <input
                  type="number"
                  id="portInput"
                  className="form-control"
                  placeholder="e.g., 22"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="usernameInput" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  id="usernameInput"
                  className="form-control"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="mb-5">
                <label htmlFor="passwordInput" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  id="passwordInput"
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="d-flex flex-column flex-sm-row gap-3">
                <button
                  type="button"
                  className="btn custom-btn-primary w-100 hyper-connect-btn"
                  onClick={handleConnect}
                >
                  Connect
                </button>
                <button
                  type="button"
                  className="btn custom-btn-warning w-100 hyper-reset-btn"
                  onClick={handleReset}
                >
                  Reset
                </button>
              </div>
            </form>

            {alertMessage && (
              <div
                className={`alert alert-${alertVariant} alert-dismissible fade show mt-4`}
                role="alert"
              >
                <div className="d-flex justify-content-between">
                  <span>{alertMessage}</span>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setAlertMessage("")}
                  ></button>
                </div>
              </div>
            )}

            {connected && (
              <div className="alert alert-success mt-4" role="alert">
                <div className="d-flex justify-content-between">
                  <span>Connected to server!</span>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setConnected(false)}
                  ></button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Content>
  );
};

export { RemoteSSHPage };
