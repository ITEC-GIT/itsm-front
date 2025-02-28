import React from "react";
interface StatCardProps {
  leftTop?: string;
  leftBottom?: string;
  rightTop?: string;
  rightBottom?: string;
  center?: string | number | React.ReactNode;
  strokeColor?: { start: string; end: string };
}

const getColorByPercentage = (percentage: number): string => {
  if (percentage < 30) return "red";
  if (percentage < 70) return "orange";
  return "green";
};

const StatCard: React.FC<StatCardProps> = ({
  leftTop,
  leftBottom,
  rightTop,
  rightBottom,
  center,
  strokeColor,
}) => {
  let renderedCenter: React.ReactNode;

  const gradientId = `gradientStroke-${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  const gradientColors = strokeColor || { start: "#ff0000", end: "#00ff00" }; // Default gradient

  if (typeof center === "number") {
    renderedCenter = (
      <div
        className="progress-circle"
        style={{ position: "relative", width: "100px", height: "100px" }}
      >
        <svg width="100" height="100" viewBox="0 0 100 100">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={gradientColors.start} />
              <stop offset="100%" stopColor={gradientColors.end} />
            </linearGradient>
          </defs>

          {/* Background Circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="#ddd"
            strokeWidth="5"
            fill="none"
          />

          {/* Gradient Stroke Circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke={`url(#${gradientId})`}
            strokeWidth="5"
            fill="none"
            strokeDasharray="251.2"
            strokeDashoffset={(1 - center / 100) * 251.2}
            transform="rotate(-90 50 50)"
            style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
          />
        </svg>

        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontWeight: "bold",
            color: "#000",
            fontSize: "1.3rem",
          }}
        >
          {center}%
        </div>
      </div>
    );
  } else if (typeof center === "string") {
    renderedCenter = (
      <div className="fw-bold" dangerouslySetInnerHTML={{ __html: center }} />
    );
  } else {
    renderedCenter = <div className="w-100 p-5">{center}</div>;
  }

  return (
    <div
      className="card rounded-3 p-0"
      style={{
        height: "200px",
      }}
    >
      <div className="card-body d-flex flex-column justify-content-between h-100 p-2">
        <div className="d-flex justify-content-between">
          <span dangerouslySetInnerHTML={{ __html: leftTop || "" }} />
          <span
            dangerouslySetInnerHTML={{
              __html: rightTop ? rightTop.toString() : "",
            }}
          />
        </div>

        <div className="d-flex justify-content-center align-items-center mb-3">
          {renderedCenter}
        </div>

        <div className="d-flex justify-content-between">
          <span
            className="text-muted"
            dangerouslySetInnerHTML={{ __html: leftBottom || "" }}
          />
          <span
            className="text-muted"
            dangerouslySetInnerHTML={{
              __html: rightBottom ? rightBottom.toString() : "",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export { StatCard };
