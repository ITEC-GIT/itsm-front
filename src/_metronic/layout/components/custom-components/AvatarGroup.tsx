import { useEffect } from "react";
import { Tooltip } from "bootstrap";

interface Assignee {
    id: number;
    name: string;
    avatar?: string;
}

interface AssigneeAvatarsProps {
    assignees: Assignee[];
    maxCount: number; // Add a prop for maxCount
}

const AssigneeAvatarsCard: React.FC<AssigneeAvatarsProps> = ({ assignees, maxCount }) => {
    useEffect(() => {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltipTriggerList.forEach((tooltipEl) => new Tooltip(tooltipEl));
    }, []);

    const getInitials = (name: string): string => {
        if(name==null){
            const fgsdg=0;
            console.log(assignees)
        }
        const words = name.split(/[\s.]+/).filter(Boolean);
        return words.length > 1 ? words[0][0].toUpperCase() + words[1][0].toUpperCase() : words[0][0].toUpperCase();
    };

    const profilesRoute = import.meta.env.VITE_APP_ITSM_GLPI_API_BASE_PROFILES_URL;

    // Calculate how many avatars to show and how many to group
    const displayedAvatars = assignees.slice(0, maxCount);
    const remainingAvatarsCount = assignees.length - maxCount;

    return (
        <div className="d-flex flex-wrap gap-3 special-assignee-child">
            {displayedAvatars.map((assignee) => (
                <div key={assignee.id} className="d-flex align-items-center gap-2">
                    {/* Avatar or Default Avatar */}
                    {assignee.avatar ? (
                        <img
                            src={`${profilesRoute}/${assignee.avatar}`}
                            alt={assignee.name}
                            className="rounded-circle shadow reply-details-assignees"
                            style={{ width: "32px", height: "32px", objectFit: "cover", cursor: "pointer" }}
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title={assignee.name}
                        />
                    ) : (
                        <div
                            className="d-flex justify-content-center align-items-center rounded-circle shadow"
                            style={{
                                width: "32px",
                                height: "32px",
                                fontSize: "14px",
                                fontWeight: "bold",
                                background: "linear-gradient(135deg, #FF6B6B, #6B73FF)",
                                color: "white",
                                cursor: "pointer",
                            }}
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title={assignee.name}
                        >
                            {getInitials(assignee.name)}
                        </div>
                    )}

                    {/* Initials next to Avatar */}
                    <span style={{ fontSize: "14px", fontWeight: "bold" }}>{getInitials(assignee.name)}</span>
                </div>
            ))}

            {/* "More" Avatar */}
            {remainingAvatarsCount > 0 && (
                <div
                    className="d-flex align-items-center gap-2"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title={`+${remainingAvatarsCount} more`}
                >
                    <div
                        className="d-flex justify-content-center align-items-center rounded-circle shadow"
                        style={{
                            width: "32px",
                            height: "32px",
                            fontSize: "14px",
                            fontWeight: "bold",
                            background: "#6B73FF",
                            color: "white",
                            cursor: "pointer",
                        }}
                    >
                        +{remainingAvatarsCount}
                    </div>
                    {/*<span style={{ fontSize: "14px", fontWeight: "bold" }}>*/}
                    {/*    +{remainingAvatarsCount}*/}
                    {/*</span>*/}
                </div>
            )}
        </div>
    );
};

export default AssigneeAvatarsCard;
