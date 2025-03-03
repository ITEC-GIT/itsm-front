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
    <ul className="nav flex-column">
      {buttons.map((button) => (
        <li className="nav-item" key={button.id}>
          <button
            className={`nav-link text-dark ${
              button.id === selectedId ? "active bg-secondary text-white" : ""
            }`}
            onClick={() => onButtonClick(button.id)}
            style={{
              border: "none",
              background: "none",
              width: "100%",
              textAlign: "left",
            }}
          >
            <i className={`bi ${button.icon} text-dark`}></i> {button.text}
          </button>
        </li>
      ))}
    </ul>
  );
};

export { Sidebar };
