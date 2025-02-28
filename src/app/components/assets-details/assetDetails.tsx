const AssetDetailsComponent = ({ asset }: { asset: any }) => {
  return (
    <div className="row justify-content-center vertical-scroll p-2">
      <div className="col-md-12">
        <div className="row rounded shadow-sm me-2 p-4">
          <div className="col-md-4">
            <div className="detail-item mb-3">
              <strong className="d-block text-muted">Serial Number:</strong>
              <span>{asset.serialNumber || "N/A"}</span>
            </div>
            <div className="detail-item mb-3">
              <strong className="d-block text-muted">Location:</strong>
              <span>{asset.location || "N/A"}</span>
            </div>
            <div className="detail-item mb-3">
              <strong className="d-block text-muted">Purchase Date:</strong>
              <span>{asset.purchaseDate || "N/A"}</span>
            </div>
            <div className="detail-item mb-3">
              <strong className="d-block text-muted">Serial Number:</strong>
              <span>{asset.serialNumber || "N/A"}</span>
            </div>
            <div className="detail-item mb-3">
              <strong className="d-block text-muted">Location:</strong>
              <span>{asset.location || "N/A"}</span>
            </div>
            <div className="detail-item mb-3">
              <strong className="d-block text-muted">Purchase Date:</strong>
              <span>{asset.purchaseDate || "N/A"}</span>
            </div>
            <div className="detail-item mb-3">
              <strong className="d-block text-muted">Serial Number:</strong>
              <span>{asset.serialNumber || "N/A"}</span>
            </div>
            <div className="detail-item mb-3">
              <strong className="d-block text-muted">Location:</strong>
              <span>{asset.location || "N/A"}</span>
            </div>
            <div className="detail-item mb-3">
              <strong className="d-block text-muted">Purchase Date:</strong>
              <span>{asset.purchaseDate || "N/A"}</span>
            </div>
          </div>
          <div className="col-md-4">
            <div className="detail-item mb-3">
              <strong className="d-block text-muted">Serial Number:</strong>
              <span>{asset.serialNumber || "N/A"}</span>
            </div>
            <div className="detail-item mb-3">
              <strong className="d-block text-muted">Location:</strong>
              <span>{asset.location || "N/A"}</span>
            </div>
            <div className="detail-item mb-3">
              <strong className="d-block text-muted">Purchase Date:</strong>
              <span>{asset.purchaseDate || "N/A"}</span>
            </div>
            <div className="detail-item mb-3">
              <strong className="d-block text-muted">Value:</strong>
              <span>${asset.value || "N/A"}</span>
            </div>
            <div className="detail-item mb-3">
              <strong className="d-block text-muted">Description:</strong>
              <span className="text-wrap">
                {asset.description || "No description available."}
              </span>
            </div>
            <div className="detail-item mb-3">
              <strong className="d-block text-muted">Serial Number:</strong>
              <span>{asset.serialNumber || "N/A"}</span>
            </div>
            <div className="detail-item mb-3">
              <strong className="d-block text-muted">Location:</strong>
              <span>{asset.location || "N/A"}</span>
            </div>
            <div className="detail-item mb-3">
              <strong className="d-block text-muted">Purchase Date:</strong>
              <span>{asset.purchaseDate || "N/A"}</span>
            </div>
          </div>
          <div className="col-md-4">
            <div className="detail-item mb-3">
              <strong className="d-block text-muted">Serial Number:</strong>
              <span>{asset.serialNumber || "N/A"}</span>
            </div>
            <div className="detail-item mb-3">
              <strong className="d-block text-muted">Location:</strong>
              <span>{asset.location || "N/A"}</span>
            </div>
            <div className="detail-item mb-3">
              <strong className="d-block text-muted">Purchase Date:</strong>
              <span>{asset.purchaseDate || "N/A"}</span>
            </div>
            <div className="detail-item mb-3">
              <strong className="d-block text-muted">Value:</strong>
              <span>${asset.value || "N/A"}</span>
            </div>
            <div className="detail-item mb-3">
              <strong className="d-block text-muted">Description:</strong>
              <span className="text-wrap">
                {asset.description || "No description available."}
              </span>
            </div>
            <div className="detail-item mb-3">
              <strong className="d-block text-muted">Serial Number:</strong>
              <span>{asset.serialNumber || "N/A"}</span>
            </div>
            <div className="detail-item mb-3">
              <strong className="d-block text-muted">Location:</strong>
              <span>{asset.location || "N/A"}</span>
            </div>
            <div className="detail-item mb-3">
              <strong className="d-block text-muted">Purchase Date:</strong>
              <span>{asset.purchaseDate || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AssetDetailsComponent };
