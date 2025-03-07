const ProgressBar = ({
  used,
  total,
  gradientColor,
}: {
  used: number;
  total: number;
  gradientColor: string;
}) => {
  const percentage = (((total - used) / total) * 100).toFixed(2);

  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-between">
        <span>C:</span>
        <span>{percentage}%</span>
      </div>
      <div className="progress mt-1" style={{ height: "10px", width: "100%" }}>
        <div
          className="progress-bar"
          role="progressbar"
          style={{
            width: `${percentage}%`,
            background: gradientColor,
          }}
          aria-valuenow={parseFloat(percentage)}
          aria-valuemin={0}
          aria-valuemax={100}
        ></div>
      </div>
    </div>
  );
};
export { ProgressBar };
