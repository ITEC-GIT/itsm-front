import { useNavigate } from "react-router-dom";

const BackButton = ({
  navigateFrom,
  navigateTo,
}: {
  navigateFrom: string;
  navigateTo: string;
}) => {
  const navigate = useNavigate();

  return (
    <button
      className="btn btn-sm btn-light"
      onClick={() =>
        navigate(`/${navigateTo}`, { state: { from: `${navigateFrom}` } })
      }
    >
      <i className="fa fa-arrow-left me-2"></i> Back
    </button>
  );
};

export { BackButton };
