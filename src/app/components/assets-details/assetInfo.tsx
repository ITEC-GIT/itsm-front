import { AvatarComponent } from "../form/avatar";

const AssetInfoComponent = () => {
  return (
    <div className="row d-flex flex-column flex-md-row justify-content-between mb-4 ps-5 pe-2">
      <div className="col-12 col-md-6 d-flex gap-2 p-0">
        <i className="bi bi-hdd me-2 type-icon"></i>
        <div className="d-flex flex-column w-100">
          <div className="d-flex  align-items-center gap-2">
            <h3 className="mb-0">DESKTOP-1FEPMGR</h3>
            <span className="badge bg-success status-badge">ONLINE</span>
          </div>

          <div className="d-flex  align-items-center gap-2 mt-2">
            <div>
              <AvatarComponent
                user={{
                  id: 15,
                  name: "John Doe",
                }}
              />
            </div>
            <span className="sync-date">last sync 2 minutes ago</span>
          </div>

          <div className="d-flex  align-items-center gap-2 mt-2">
            <div>
              <i className="bi bi-geo-alt-fill location-icon"></i>
              <span className="location-text">Lebanon - Beirut</span>
            </div>
            <div>
              <i className="bi bi-buildings location-icon"></i>
              <span className="location-text">Hara</span>
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-6 d-flex flex-wrap justify-content-md-end mt-3 mt-md-0 p-0">
        <button className="btn custom-btn me-2 mb-2">
          <i className="bi bi-terminal"></i> Terminal
        </button>
        {/* <button className="btn custom-btn me-2 mb-2">
          <i className="bi bi-play-circle"></i> Run Script
        </button> */}
        <button className="btn custom-btn me-2 mb-2">
          <i className="bi bi-tv"></i> Remote
        </button>
        <button className="btn custom-btn me-2 mb-2">
          <i className="bi bi-gear"></i> Actions
        </button>
      </div>
    </div>
  );
};

export { AssetInfoComponent };
