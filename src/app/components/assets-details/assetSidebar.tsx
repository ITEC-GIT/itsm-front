interface ButtonProps {
  id: number;
  text: string;
  icon: string;
}

interface SidebarProps {
  buttons: ButtonProps[];
  selectedId: number;
  onButtonClick: (id: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  buttons,
  selectedId,
  onButtonClick,
}) => {
  return (
    <ul
      className="nav flex-column"
      style={{ maxHeight: "100%", overflowY: "auto", overflowX: "hidden" }}
    >
      {buttons.map((button) => (
        <li className="nav-item nav-item-li mb-3 p-0" key={button.id}>
          <button
            className={`nav-link nav-link-btn text-dark  ${
              button.id === selectedId ? "active" : ""
            }`}
            onClick={() => onButtonClick(button.id)}
          >
            <i className={`bi ${button.icon} text-dark`}></i>
            <span className="d-none d-sm-inline ms-2">{button.text}</span>{" "}
          </button>
        </li>
      ))}
    </ul>
  );
};

export { Sidebar };
