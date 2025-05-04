import { useAtom } from "jotai";
import { selectedComputerInfoAtom } from "../../atoms/assets-atoms/assetAtoms";
import { useEffect, useState } from "react";

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

const logs2: LogItem[] = [
  {
    icon: "bi bi-hdd",
    title: "CrystalDiskInfo",
    status: "Success",
    time: "14:02",
    date: "01/24/2025",
  },
  {
    icon: "bi bi-terminal",
    title: "Command Prompt opened by John Doe",
    time: "13:55",
    date: "01/24/2025",
  },
  {
    icon: "bi bi-globe",
    title: "Google Chrome (Update)",
    status: "Success",
    time: "13:48",
    date: "01/24/2025",
  },
  {
    icon: "bi bi-cpu",
    title: "Intel Processor Driver",
    status: "Failure",
    time: "13:44",
    date: "01/24/2025",
  },
  {
    icon: "bi bi-box-seam",
    title: "7-Zip Installed",
    status: "Success",
    time: "13:32",
    date: "01/24/2025",
  },
  {
    icon: "bi bi-download",
    title: "Zoom Client (Install)",
    status: "Triggered",
    time: "13:20",
    date: "01/24/2025",
  },
  {
    icon: "bi bi-box",
    title: "Slack",
    status: "Success",
    time: "13:16",
    date: "01/24/2025",
  },
  {
    icon: "bi bi-exclamation-triangle",
    title: "Malwarebytes Scan",
    status: "Failure",
    time: "13:12",
    date: "01/24/2025",
  },
  {
    icon: "bi bi-download",
    title: "Node.js LTS Installed",
    status: "Success",
    time: "13:05",
    date: "01/24/2025",
  },
  {
    icon: "bi bi-terminal",
    title: "Remote SSH session initiated by Admin",
    time: "13:00",
    date: "01/24/2025",
  },
  {
    icon: "bi bi-file-earmark-text",
    title: "License agreement accepted for Adobe Reader",
    status: "Success",
    time: "12:58",
    date: "01/24/2025",
  },
  {
    icon: "bi bi-box",
    title: "Microsoft Teams",
    status: "Triggered",
    time: "12:45",
    date: "01/24/2025",
  },
  {
    icon: "bi bi-download",
    title: "Spotify Installer",
    status: "Failure",
    time: "12:36",
    date: "01/24/2025",
  },
  {
    icon: "bi bi-cpu",
    title: "AMD Radeon Driver",
    status: "Success",
    time: "12:30",
    date: "01/24/2025",
  },
  {
    icon: "bi bi-box",
    title: "Git for Windows",
    status: "Triggered",
    time: "12:26",
    date: "01/24/2025",
  },
  {
    icon: "bi bi-terminal",
    title: "PowerShell script executed by Automation Agent",
    time: "12:22",
    date: "01/24/2025",
  },
  {
    icon: "bi bi-download",
    title: "Visual Studio Code",
    status: "Success",
    time: "12:20",
    date: "01/24/2025",
  },
  {
    icon: "bi bi-cpu",
    title: "System Monitor Activated",
    status: "Success",
    time: "12:17",
    date: "01/24/2025",
  },
  {
    icon: "bi bi-shield-lock",
    title: "Bitdefender Scanner",
    status: "Failure",
    time: "12:13",
    date: "01/24/2025",
  },
  {
    icon: "bi bi-box",
    title: "VS Code Extensions Installed",
    status: "Success",
    time: "12:09",
    date: "01/24/2025",
  },
];

const logs3: LogItem[] = [
  {
    icon: "bi bi-download",
    title: "VLC Media Player (Install)",
    status: "Success",
    time: "13:10",
    date: "01/23/2025",
  },
  {
    icon: "bi bi-shield-exclamation",
    title: "Avast Free Antivirus",
    status: "Failure",
    time: "13:09",
    date: "01/23/2025",
  },
  {
    icon: "bi bi-box",
    title: "OneDrive Sync Tool",
    status: "Triggered",
    time: "13:07",
    date: "01/23/2025",
  },
  {
    icon: "bi bi-terminal",
    title: "Terminal (bash) accessed by Admin",
    time: "13:06",
    date: "01/23/2025",
  },
  {
    icon: "bi bi-download",
    title: "Brave Browser (Install)",
    status: "Success",
    time: "13:05",
    date: "01/23/2025",
  },
  {
    icon: "bi bi-cpu",
    title: "NVIDIA Graphics Driver",
    status: "Success",
    time: "13:03",
    date: "01/23/2025",
  },
  {
    icon: "bi bi-shield-exclamation",
    title: "McAfee WebAdvisor",
    status: "Triggered",
    time: "13:01",
    date: "01/23/2025",
  },
  {
    icon: "bi bi-terminal",
    title: "Terminal opened by IT Support",
    time: "12:59",
    date: "01/23/2025",
  },
  {
    icon: "bi bi-download",
    title: "OBS Studio (Install)",
    status: "Failure",
    time: "12:58",
    date: "01/23/2025",
  },
  {
    icon: "bi bi-cpu",
    title: "AMD Ryzen Chipset Drivers",
    status: "Success",
    time: "12:56",
    date: "01/23/2025",
  },
  {
    icon: "bi bi-box",
    title: "Trello Desktop",
    status: "Triggered",
    time: "12:54",
    date: "01/23/2025",
  },
  {
    icon: "bi bi-terminal",
    title: "Terminal used by root user",
    time: "12:52",
    date: "01/23/2025",
  },
  {
    icon: "bi bi-download",
    title: "Spotify (Install)",
    status: "Success",
    time: "12:51",
    date: "01/23/2025",
  },
  {
    icon: "bi bi-box",
    title: "Zoom Plugin for Outlook",
    status: "Success",
    time: "12:49",
    date: "01/23/2025",
  },
  {
    icon: "bi bi-shield-exclamation",
    title: "ZoneAlarm Firewall",
    status: "Failure",
    time: "12:47",
    date: "01/23/2025",
  },
  {
    icon: "bi bi-download",
    title: "Slack Update",
    status: "Success",
    time: "12:46",
    date: "01/23/2025",
  },
  {
    icon: "bi bi-cpu",
    title: "Intel Management Engine Interface",
    status: "Success",
    time: "12:45",
    date: "01/23/2025",
  },
  {
    icon: "bi bi-terminal",
    title: "Terminal access logged by audit",
    time: "12:44",
    date: "01/23/2025",
  },
  {
    icon: "bi bi-box",
    title: "Figma Desktop App",
    status: "Triggered",
    time: "12:42",
    date: "01/23/2025",
  },
  {
    icon: "bi bi-download",
    title: "Notepad++",
    status: "Success",
    time: "12:41",
    date: "01/23/2025",
  },
];

const logs4: LogItem[] = [
  {
    icon: "bi bi-download",
    title: "GIMP Image Editor (Install)",
    status: "Success",
    time: "09:12",
    date: "01/24/2025",
  },
  {
    icon: "bi bi-cpu",
    title: "Realtek Audio Driver",
    status: "Failure",
    time: "09:10",
    date: "01/24/2025",
  },
  {
    icon: "bi bi-terminal",
    title: "Shell Access by Lina Amari",
    time: "09:08",
    date: "01/24/2025",
  },
  {
    icon: "bi bi-box",
    title: "Zoom for Chrome",
    status: "Triggered",
    time: "09:07",
    date: "01/24/2025",
  },
  {
    icon: "bi bi-shield-exclamation",
    title: "Trend Micro Antivirus",
    status: "Success",
    time: "09:04",
    date: "01/24/2025",
  },
  {
    icon: "bi bi-download",
    title: "Paint.NET Setup",
    status: "Triggered",
    time: "09:03",
    date: "01/24/2025",
  },
  {
    icon: "bi bi-cpu",
    title: "ASUS AI Suite 3",
    status: "Success",
    time: "09:01",
    date: "01/24/2025",
  },
  {
    icon: "bi bi-terminal",
    title: "Terminal launched by SupportBot",
    time: "08:59",
    date: "01/24/2025",
  },
  {
    icon: "bi bi-box",
    title: "Webex App",
    status: "Success",
    time: "08:58",
    date: "01/24/2025",
  },
  {
    icon: "bi bi-shield-exclamation",
    title: "Sophos Endpoint Agent",
    status: "Failure",
    time: "08:55",
    date: "01/24/2025",
  },
  {
    icon: "bi bi-download",
    title: "Discord Setup",
    status: "Success",
    time: "08:54",
    date: "01/24/2025",
  },
  {
    icon: "bi bi-cpu",
    title: "Dell Power Manager",
    status: "Triggered",
    time: "08:53",
    date: "01/24/2025",
  },
  {
    icon: "bi bi-terminal",
    title: "Terminal opened by Ahmed Salim",
    time: "08:51",
    date: "01/24/2025",
  },
  {
    icon: "bi bi-box",
    title: "Cisco VPN Client",
    status: "Success",
    time: "08:49",
    date: "01/24/2025",
  },
  {
    icon: "bi bi-download",
    title: "WinRAR Setup",
    status: "Failure",
    time: "08:48",
    date: "01/24/2025",
  },
  {
    icon: "bi bi-cpu",
    title: "Lenovo System Update Tool",
    status: "Success",
    time: "08:47",
    date: "01/24/2025",
  },
  {
    icon: "bi bi-terminal",
    title: "Terminal (zsh) launched by devops",
    time: "08:45",
    date: "01/24/2025",
  },
  {
    icon: "bi bi-box",
    title: "Figma Installer",
    status: "Triggered",
    time: "08:44",
    date: "01/24/2025",
  },
  {
    icon: "bi bi-shield-exclamation",
    title: "ESET Internet Security",
    status: "Success",
    time: "08:42",
    date: "01/24/2025",
  },
  {
    icon: "bi bi-download",
    title: "Chrome Remote Desktop Host",
    status: "Triggered",
    time: "08:41",
    date: "01/24/2025",
  },
];
const logs5: LogItem[] = [
  {
    icon: "bi bi-box",
    title: "Adobe Acrobat Reader DC",
    status: "Success",
    time: "10:15",
    date: "01/25/2025",
  },
  {
    icon: "bi bi-download",
    title: "VS Code Extension Pack (Install)",
    status: "Success",
    time: "10:13",
    date: "01/25/2025",
  },
  {
    icon: "bi bi-shield-exclamation",
    title: "Bitdefender Endpoint Security",
    status: "Failure",
    time: "10:10",
    date: "01/25/2025",
  },
  {
    icon: "bi bi-terminal",
    title: "Shell session initiated by John M.",
    time: "10:08",
    date: "01/25/2025",
  },
  {
    icon: "bi bi-box",
    title: "Skype for Business",
    status: "Triggered",
    time: "10:06",
    date: "01/25/2025",
  },
  {
    icon: "bi bi-cpu",
    title: "Intel Rapid Storage Technology",
    status: "Success",
    time: "10:04",
    date: "01/25/2025",
  },
  {
    icon: "bi bi-download",
    title: "LibreOffice Full Setup",
    status: "Success",
    time: "10:02",
    date: "01/25/2025",
  },
  {
    icon: "bi bi-box",
    title: "Zoom Plugin for Gmail",
    status: "Failure",
    time: "10:00",
    date: "01/25/2025",
  },
  {
    icon: "bi bi-shield-exclamation",
    title: "Windows Defender Signature Update",
    status: "Triggered",
    time: "09:59",
    date: "01/25/2025",
  },
  {
    icon: "bi bi-terminal",
    title: "PowerShell run by scheduler",
    time: "09:57",
    date: "01/25/2025",
  },
  {
    icon: "bi bi-download",
    title: "Node.js v18.x Installer",
    status: "Success",
    time: "09:55",
    date: "01/25/2025",
  },
  {
    icon: "bi bi-cpu",
    title: "HP Audio Drivers",
    status: "Triggered",
    time: "09:53",
    date: "01/25/2025",
  },
  {
    icon: "bi bi-box",
    title: "Microsoft Teams Add-in for Outlook",
    status: "Success",
    time: "09:51",
    date: "01/25/2025",
  },
  {
    icon: "bi bi-shield-exclamation",
    title: "Comodo Antivirus",
    status: "Failure",
    time: "09:48",
    date: "01/25/2025",
  },
  {
    icon: "bi bi-terminal",
    title: "Shell access logged by audit tool",
    time: "09:46",
    date: "01/25/2025",
  },
  {
    icon: "bi bi-download",
    title: "Docker Desktop",
    status: "Triggered",
    time: "09:45",
    date: "01/25/2025",
  },
  {
    icon: "bi bi-cpu",
    title: "Microsoft .NET Framework 4.8",
    status: "Success",
    time: "09:43",
    date: "01/25/2025",
  },
  {
    icon: "bi bi-box",
    title: "Notion Installer",
    status: "Success",
    time: "09:41",
    date: "01/25/2025",
  },
  {
    icon: "bi bi-shield-exclamation",
    title: "Avira Security Suite",
    status: "Success",
    time: "09:40",
    date: "01/25/2025",
  },
  {
    icon: "bi bi-download",
    title: "Java Runtime Environment (JRE)",
    status: "Failure",
    time: "09:38",
    date: "01/25/2025",
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

const getRandomLogsForComputer = (computerId: number): LogItem[] => {
  const allLogs = [...logs, ...logs2, ...logs3, ...logs4, ...logs5];
  const seed = computerId % allLogs.length;

  const shuffled = allLogs
    .map((log, i) => ({ log, sort: (i + seed * 7) % 23 }))
    .sort((a, b) => a.sort - b.sort)
    .map((entry) => entry.log);

  return shuffled.slice(0, 20);
};

const AssetHistoryComponent: React.FC<{ devHeight: number }> = ({
  devHeight,
}) => {
  const [selectedComputerInfo] = useAtom(selectedComputerInfoAtom);
  const [randomizedLogs, setRandomizedLogs] = useState<LogItem[]>([]);

  useEffect(() => {
    if (selectedComputerInfo?.id) {
      setRandomizedLogs(getRandomLogsForComputer(selectedComputerInfo.id));
    }
  }, [selectedComputerInfo?.id]);

  return (
    <div
      className="none-scroll-width vertical-scroll p-2"
      style={{
        height: `calc(100vh - var(--bs-app-header-height) - ${devHeight}px) `,
      }}
    >
      <h6 className="fw-bold">
        Last logged in by &nbsp;
        <span className="text-primary">{selectedComputerInfo.name}</span>
      </h6>
      <p className="text-muted">
        Login time <strong>01/21/2025 14:27</strong>
      </p>

      <ul className="list-group list-group-flush">
        {randomizedLogs.map((log, index) => (
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
