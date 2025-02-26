const AssetsPage = () => {
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <div className="btn-group">
          <button className="btn btn-secondary">
            <i className="fas fa-download"></i> Download Agent
          </button>
          <button className="btn btn-secondary">
            <i className="fas fa-columns"></i> Columns
          </button>
          <button className="btn btn-secondary">
            <i className="fas fa-filter"></i> Filter
          </button>
        </div>
      </div>
    </div>
  );
};

const AssetsPageWrapper = () => {
  return <AssetsPage />;
};

export { AssetsPageWrapper };
