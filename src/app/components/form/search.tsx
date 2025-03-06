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
        <input
          type="text"
          className="form-control form-control-solid"
          placeholder="Search..."
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export { SearchComponent };
