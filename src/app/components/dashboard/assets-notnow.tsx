export function Assets() {
  return (
    <>
      <div className="container-fluid">
        <div className="row mb-4">
          <div className="col">
            <h1 className="text-primary">Asset </h1>
          </div>
          <div className="col text-end">
            <button className="btn btn-primary me-2">Add Asset</button>
            <button className="btn btn-secondary">Search</button>
          </div>
        </div>

        <div className="row">
          <div className="col-md-3">
            <div className="list-group">
              <a
                href="#"
                className="list-group-item list-group-item-action active"
              >
                Assets
              </a>
              <a href="#" className="list-group-item list-group-item-action">
                Hyper Commands
              </a>
              <a href="#" className="list-group-item list-group-item-action">
                Anti-Theft
              </a>
              <a href="#" className="list-group-item list-group-item-action">
                Reports
              </a>
            </div>
          </div>

          <div className="col-md-9">
            <div className="row">
              <div className="col-md-4">
                <div className="card">
                  <div className="card-body p-0">
                    <div className="bg-primary text-white px-4 py-3">
                      <h3 className="fw-bold">Laptop 001</h3>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-bold fs-4">Owner: John Doe</span>
                        <button className="btn btn-sm btn-light">
                          Details
                        </button>
                      </div>
                    </div>
                    <div className="px-4 py-3">
                      <p className="mb-2">
                        <strong>Status:</strong> Online
                      </p>
                      <p className="mb-2">
                        <strong>Processes:</strong> 4 Active
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* <!-- Repeat similar cards for other assets --> */}
            </div>

            {/* <!-- Detailed Asset Processes --> */}
            <div className="card mt-4">
              <div className="card-header bg-secondary text-white">
                <h4>Asset Details: Laptop 001</h4>
              </div>
              <div className="card-body">
                <div className="row">
                  {/* <!-- Hyper Commands --> */}
                  <div className="col-md-6">
                    <h5>Hyper Commands</h5>
                    <ul className="list-group">
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        Software Installation
                        <span className="badge bg-success">Active</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        Remote SSH
                        <span className="badge bg-danger">Failed</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        Remote Console
                        <span className="badge bg-warning">Pending</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        Performance Monitoring
                        <span className="badge bg-success">Active</span>
                      </li>
                    </ul>
                  </div>

                  {/* <!-- Anti-Theft --> */}
                  <div className="col-md-6">
                    <h5>Anti-Theft</h5>
                    <ul className="list-group">
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        Screen Shots
                        <span className="badge bg-success">Captured</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        Camera Picture
                        <span className="badge bg-warning">Pending</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        Voice Record
                        <span className="badge bg-danger">Failed</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
