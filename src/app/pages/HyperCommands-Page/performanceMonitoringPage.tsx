import { useState } from "react";
import { ActionIcons } from "../../components/hyper-commands/action-icons";
import { Content } from "../../../_metronic/layout/components/content/Content";

const PerformanceMonitoringPage = () => {
  const [data] = useState([
    { resource: "CPU", usage: "35%" },
    { resource: "Memory", usage: "60%" },
    { resource: "Disk", usage: "80%" },
  ]);

  return (
    <Content>
      <div className="container mt-5">
        <div className="row justify-content-center mb-4">
          <div className="col-md-10 col-lg-10 col-xl-12">
            <h2 className="text-center mb-4">📊 Performance Monitoring</h2>
            <ActionIcons />
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
    </Content>
  );
};

export { PerformanceMonitoringPage };
