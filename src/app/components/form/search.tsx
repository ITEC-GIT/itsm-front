const SearchComponent = ({
  value,
  onChange,
}: {
  value: string;
  onChange: any;
}) => {
  return (
    <div style={{ width: "100%", maxWidth: "300px" }}>
      <input
        type="text"
        className="form-control form-control-solid"
        placeholder="Search..."
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export { SearchComponent };
