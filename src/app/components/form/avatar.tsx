interface User {
  id: number;
  name: string;
  avatar?: string;
}

interface AvatarsProps {
  user: User;
}

const AvatarComponent = ({ user }: AvatarsProps) => {
  const profilesRoute = import.meta.env
    .VITE_APP_ITSM_GLPI_API_BASE_PROFILES_URL;

  const getInitials = (name: string): string => {
    const words = name.split(/[\s.]+/).filter(Boolean);
    return words.length > 1
      ? words[0][0].toUpperCase() + "" + words[1][0].toUpperCase()
      : words[0][0].toUpperCase();
  };

  return (
    <div className="d-flex flex-wrap gap-3">
      <div className="d-flex align-items-center gap-2">
        {user.avatar ? (
          <img
            src={`${profilesRoute}/${user.avatar}`}
            alt={user.name}
            className="rounded-circle shadow "
            style={{
              width: "25px",
              height: "25px",
              objectFit: "cover",
              cursor: "pointer",
            }}
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title={user.name}
          />
        ) : (
          <div
            className="d-flex justify-content-center align-items-center rounded-circle shadow"
            style={{
              width: "30px",
              height: "30px",
              fontSize: "14px",
              fontWeight: "bold",
              background: "linear-gradient(135deg, #FF6B6B, #6B73FF)",
              color: "white",
              cursor: "pointer",
            }}
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title={user.name}
          >
            {getInitials(user.name)}
          </div>
        )}
      </div>
    </div>
  );
};

export { AvatarComponent };
