const SearchComponent = ({
  value,
  onChange,
}: {
  value: string;
  onChange: any;
}) => {
  return (
    <div style={{ width: "100%", maxWidth: "300px" }}>
      <div className="input-group">
        <span className="input-group-text custom-input" id="search-icon">
          <i className="bi bi-search"></i>
        </span>
        <input
          type="text"
          className="form-control custom-input"
          placeholder="Search..."
          value={value}
          onChange={onChange}
          aria-label="Search"
          aria-describedby="search-icon"
        />
      </div>
    </div>
  );
};

export { SearchComponent };
