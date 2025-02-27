import React from "react";

interface StatCardProps {
  leftTop?: string;
  leftBottom?: string;
  rightTop?: string;
  rightBottom?: string;
  center?: string | number;
  strokeColor?: string;
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
  const isPercentage = typeof center === "number";
  const color =
    strokeColor || (isPercentage ? getColorByPercentage(center) : "#007bff");

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
          {isPercentage ? (
            <div
              className="progress-circle"
              style={{
                position: "relative",
                width: "100px",
                height: "100px",
                alignSelf: "center",
              }}
            >
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#ddd"
                  strokeWidth="5"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={color}
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
                  color: color,
                  fontSize: "1.3rem",
                }}
              >
                {center}%
              </div>
            </div>
          ) : (
            <div
              className="fw-bold"
              dangerouslySetInnerHTML={{ __html: center || "" }}
            />
          )}
        </div>

        {/* Bottom Row */}
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

// <div className="card rounded-3" style={{ height: "200px" }}>
//   <div className="card-body">
//     <div className="d-flex align-items-center text-muted">
//       <i className={icon + " fs-4"}></i>
//       <span className="ms-2 fw-bold">{title}</span>
//     </div>
//     <div className="d-flex justify-content-center py-4">
//       <div
//         className="progress-circle"
//         style={{
//           position: "relative",
//           width: "64px",
//           height: "64px",
//         }}
//       >
//         <svg
//           className="progress-ring"
//           width="100%"
//           height="100%"
//           viewBox="0 0 36 36"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <circle
//             className="progress-ring-circle"
//             stroke={strokeColor}
//             strokeWidth="4"
//             fill="transparent"
//             r="15.915"
//             cx="18"
//             cy="18"
//             strokeDasharray="100 100"
//             strokeDashoffset={strokeDashoffset}
//           />
//         </svg>
//         <div
//           className="position-absolute top-50 start-50 translate-middle text-muted"
//           style={{ fontSize: "14px" }}
//         >
//           {percentage}%
//         </div>
//       </div>
//       {freeSpace && (
//         <span className="text-muted small">FREE {freeSpace}</span>
//       )}
//     </div>
//   </div>
// </div>
