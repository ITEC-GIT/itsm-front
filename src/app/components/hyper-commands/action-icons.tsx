import { useNavigate } from "react-router-dom";

const ActionIcons = () => {
  const navigate = useNavigate();
  const handleNavigation = (page: string) => {
    navigate(`/hyper-commands/${page}`);
  };

  return (
    <div className="d-flex justify-content-end mb-4">
      <div
        className="p-3"
        onClick={() => handleNavigation("software-installation")}
        style={{ cursor: "pointer" }}
      >
        <i
          className={`bi bi-hdd-fill fs-1 ${
            window.location.pathname.includes(
              "/hyper-commands/software-installation"
            )
              ? "text-primary"
              : ""
          }`}
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title="Software Installation"
        ></i>
      </div>
      <div
        className="p-3"
        onClick={() => handleNavigation("remote-ssh")}
        style={{ cursor: "pointer" }}
      >
        <i
          className={`bi bi-terminal fs-1 ${
            window.location.pathname.includes("/hyper-commands/remote-ssh")
              ? "text-primary"
              : ""
          }`}
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title="Remote SSH"
        ></i>
      </div>
      <div
        className="p-3"
        onClick={() => handleNavigation("remote-console")}
        style={{ cursor: "pointer" }}
      >
        <i
          className={`bi bi-laptop fs-1 ${
            window.location.pathname.includes("/hyper-commands/remote-console")
              ? "text-primary"
              : ""
          }`}
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title="Remote Console"
        ></i>
      </div>
    </div>
  );
};

export { ActionIcons };
