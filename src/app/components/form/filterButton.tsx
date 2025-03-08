const FilterButton = ({ toggleSidebar }: { toggleSidebar: any }) => {
  return (
    <button className="btn custom-btn" onClick={toggleSidebar} title="Filters">
      <i className="bi bi-funnel custom-btn-icon"></i>
      Filters
    </button>
  );
};

export { FilterButton };
