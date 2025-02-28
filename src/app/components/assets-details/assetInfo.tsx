const AssetInfoComponent = () => {
  return (
    <div className="d-flex justify-content-between mb-4">
      <div className="d-flex align-items-center gap-2">
        <i className="bi bi-hdd me-2 type-icon"></i>
        <div className="d-flex flex-column">
          <div className="d-flex align-items-center gap-2">
            <h3>DESKTOP-1FEPMGR</h3>
            <span className="badge bg-success status-badge">ONLINE</span>
            <span className="sync-date ">last sync 2 minutes ago</span>
          </div>

          <div className="d-flex align-items-center gap-5">
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

      <div className="asset-btn-group">
        <button className="btn hover-scale asset-action-btn">
          <i className="bi bi-terminal "></i> Terminal
        </button>
        <button className="btn hover-scale asset-action-btn">
          <i className="bi bi-play-circle "></i> Run Script
        </button>
        <button className="btn hover-scale asset-action-btn">
          <i className="bi bi-tv "></i> Remote
        </button>
        <button className="btn hover-scale asset-action-btn">
          <i className="bi bi-gear "></i> Actions
        </button>
        {/* <button className="btn hover-scale asset-action-btn">
              <i className="bi bi-tools me-1"></i>
            </button> */}
      </div>
    </div>
  );
};

export { AssetInfoComponent };
