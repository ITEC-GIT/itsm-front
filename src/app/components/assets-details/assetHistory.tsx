interface LogItem {
  icon: string;
  title: string;
  status?: "Success" | "Failure" | "Triggered";
  time: string;
  date: string;
  user?: string;
}

const logs: LogItem[] = [
  {
    icon: "bi bi-download",
    title: "4K Video Downloader (Install)",
    status: "Success",
    time: "12:33",
    date: "01/23/2025",
  },
  {
    icon: "bi bi-cpu",
    title: "Microsoft Visual C++ 2015-2022 Redistributable (x86)",
    status: "Success",
    time: "12:32",
    date: "01/23/2025",
  },
  {
    icon: "bi bi-shield-exclamation",
    title: "OpenVPN Connect v3",
    status: "Failure",
    time: "12:32",
    date: "01/23/2025",
  },
  {
    icon: "bi bi-box",
    title: "Dropbox",
    status: "Success",
    time: "12:31",
    date: "01/23/2025",
  },
  {
    icon: "bi bi-terminal",
    title: "Terminal (PowerShell) window accessed by Hari Krishna M S",
    time: "12:28",
    date: "01/23/2025",
  },
  {
    icon: "bi bi-download",
    title: "4K Video Downloader (Install)",
    status: "Triggered",
    time: "12:27",
    date: "01/23/2025",
  },
  {
    icon: "bi bi-cpu",
    title: "Microsoft Visual C++ 2015-2022 Redistributable (x86)",
    status: "Triggered",
    time: "12:27",
    date: "01/23/2025",
  },
  {
    icon: "bi bi-shield-exclamation",
    title: "OpenVPN Connect v3",
    status: "Triggered",
    time: "12:27",
    date: "01/23/2025",
  },
  {
    icon: "bi bi-box",
    title: "Dropbox",
    status: "Triggered",
    time: "12:27",
    date: "01/23/2025",
  },
  {
    icon: "bi bi-download",
    title: "4K Video Downloader (Install)",
    status: "Success",
    time: "12:33",
    date: "01/23/2025",
  },
  {
    icon: "bi bi-box",
    title: "Dropbox",
    status: "Triggered",
    time: "12:27",
    date: "01/23/2025",
  },
  {
    icon: "bi bi-box",
    title: "Dropbox",
    status: "Triggered",
    time: "12:27",
    date: "01/23/2025",
  },
  {
    icon: "bi bi-shield-exclamation",
    title: "OpenVPN Connect v3",
    status: "Failure",
    time: "12:32",
    date: "01/23/2025",
  },
  {
    icon: "bi bi-box",
    title: "Dropbox",
    status: "Triggered",
    time: "12:27",
    date: "01/23/2025",
  },
  {
    icon: "bi bi-box",
    title: "Dropbox",
    status: "Triggered",
    time: "12:27",
    date: "01/23/2025",
  },
];

const getStatusBadge = (status?: string) => {
  if (!status) return null;

  let backgroundColor, textColor;

  if (status === "Success") {
    backgroundColor = "#d4edda";
    textColor = "#0f5132";
  } else if (status === "Failure") {
    backgroundColor = "#f8d7da";
    textColor = "#842029";
  } else {
    backgroundColor = "#c8e6f9";
    textColor = "#084298";
  }

  return (
    <span className="badge ms-2" style={{ backgroundColor, color: textColor }}>
      {status}
    </span>
  );
};

const AssetHistoryComponent = () => {
  return (
    <div className="vertical-scroll p-2">
      <h6 className="fw-bold">
        Last logged in by &nbsp;
        <span className="text-primary">DESKTOP-1FEPMGR</span>
      </h6>
      <p className="text-muted">
        Login time <strong>01/21/2025 14:27</strong>
      </p>

      <ul className="list-group list-group-flush">
        {logs.map((log, index) => (
          <li key={index} className="list-group-item d-flex align-items-center">
            <i className={`${log.icon} text-primary me-3 fs-5`}></i>
            <div className="flex-grow-1">
              <span dangerouslySetInnerHTML={{ __html: log.title }} />
              {getStatusBadge(log.status)}
              <p className="text-muted mb-0 small">
                {log.time} &nbsp; {log.date}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export { AssetHistoryComponent };
