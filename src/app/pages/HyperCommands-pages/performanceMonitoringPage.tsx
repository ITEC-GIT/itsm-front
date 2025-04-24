import { useState } from "react";
import { ActionIcons } from "../../components/hyper-commands/action-icons";

const PerformanceMonitoringPage = ({
  computerIdProp,
}: {
  computerIdProp?: number;
}) => {
  const [data] = useState([
    { resource: "CPU", usage: "35%" },
    { resource: "Memory", usage: "60%" },
    { resource: "Disk", usage: "80%" },
  ]);

  return (
    <div className="card-container h-100 d-flex flex-column pt-3 pb-3">
      <div
        className="row d-flex custom-main-container custom-container-height"
        style={{ overflowY: "auto" }}
      >
        <div className="col-12">
          {!computerIdProp && (
            <div className="d-flex justify-content-between">
              <h2 className="text-center mb-4">📊 Performance Monitoring</h2>
              <ActionIcons />
            </div>
          )}

          <div className="table-responsive">
            <table className="table table-striped table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th scope="col">Resource</th>
                  <th scope="col">Usage</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    <td>{item.resource}</td>
                    <td>{item.usage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export { PerformanceMonitoringPage };
