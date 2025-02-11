import React from "react";
import { KTIcon } from "../../../helpers";

interface Props {
  className: string;
  color: string;
  svgIcon: string;
  iconColor: string;
  title: string;
  titleColor: string;
  description: string;
  descriptionColor: string;
  progress?: number;
  progressColor?: string;
}

//ask for percentage
//could we reach 1M tickets

const StatisticsWidget5: React.FC<Props> = ({
  className,
  color,
  svgIcon,
  iconColor,
  title,
  titleColor,
  description,
  descriptionColor,
  progress,
  progressColor,
}) => {
  return (
    <a
      href="#"
      className={`card bg-${color} hoverable ${className} p-3 shadow-sm`}
      style={{
        borderRadius: "15px",
        overflow: "hidden",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      <div
        className="card-body d-flex flex-column align-items-center text-center"
        style={{ position: "relative" }}
      >
        <div
          className="position-relative d-flex justify-content-center align-items-center"
          style={{
            width: "100px",
            height: "100px",
            marginBottom: "1rem",
          }}
        >
          {progress && progressColor && (
            <svg
              className="position-absolute w-100 h-100"
              viewBox="0 0 36 36"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="18"
                cy="18"
                r="15.9155"
                fill="none"
                stroke="#e0e0e0"
                strokeWidth="2"
              />

              <circle
                cx="18"
                cy="18"
                r="15.9155"
                fill="none"
                stroke={`url(#gradient-${progressColor})`}
                strokeWidth="2"
                strokeDasharray="100"
                strokeDashoffset={100 - progress}
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
              />

              <defs>
                <linearGradient
                  id={`gradient-${progressColor}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop
                    offset="0%"
                    style={{ stopColor: "#4caf50", stopOpacity: 1 }}
                  />
                  <stop
                    offset="100%"
                    style={{ stopColor: "#81c784", stopOpacity: 1 }}
                  />
                </linearGradient>
              </defs>
            </svg>
          )}

          <div
            className={`position-absolute d-flex flex-column align-items-center ${
              !(progress && progressColor) ? "gap-3" : ""
            }`}
            style={{ zIndex: 1 }}
          >
            <KTIcon
              iconName={svgIcon}
              className={`text-${iconColor} fs-3x ms-n1`}
            />
            <span className={`fw-bold text-${descriptionColor}`}>
              {description}
            </span>
          </div>
        </div>

        <div
          className={`text-${titleColor} fw-bold fs-5 mb-2`}
          style={{ textTransform: "uppercase", letterSpacing: "1px" }}
        >
          {title}
        </div>

        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background:
              "linear-gradient(120deg, rgba(255,255,255,0.1), transparent)",
            zIndex: 0,
          }}
        ></div>
      </div>

      <style>{`
        .hoverable:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </a>
  );
};

export { StatisticsWidget5 };

//main one
// type Props = {
//   className: string;
//   color: string;
//   svgIcon: string;
//   iconColor: string;
//   title: string;
//   titleColor?: string;
//   description: string;
//   descriptionColor?: string;
// };

// const StatisticsWidget5: React.FC<Props> = ({
//   className,
//   color,
//   svgIcon,
//   iconColor,
//   title,
//   titleColor,
//   description,
//   descriptionColor,
// }) => {
//   return (
//     <a href="#" className={`card bg-${color} hoverable ${className}`}>
//       <div className="card-body">
//         <KTIcon
//           iconName={svgIcon}
//           className={`text-${iconColor} fs-2x ms-n1`}
//         />

//         <div
//           className={`text-${titleColor} fw-bold fs-2 mb-2 mt-5 d-flex text-nowrap`}
//         >
//           {title}
//         </div>

//         <div className={`fw-semibold text-${descriptionColor}`}>
//           {description}
//         </div>
//       </div>
//     </a>
//   );
// };

// export { StatisticsWidget5 };
