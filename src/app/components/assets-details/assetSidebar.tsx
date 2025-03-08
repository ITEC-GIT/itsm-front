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
        <li className="nav-item nav-item-li mb-3" key={button.id}>
          <button
            className={`nav-link nav-link-btn text-dark ${
              button.id === selectedId ? "active" : ""
            }`}
            onClick={() => onButtonClick(button.id)}
          >
            <i className={`bi ${button.icon} text-dark`}></i> {button.text}
          </button>
        </li>
      ))}
    </ul>
  );
};

export { Sidebar };
